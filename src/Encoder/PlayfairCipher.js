import Encoder from '../Encoder.js'

const meta = {
  name: 'playfair-cipher',
  title: 'Playfair cipher',
  category: 'Ciphers',
  type: 'encoder'
}

const alphabet = 'abcdefghiklmnopqrstuvwxyz'

/**
 * Encoder brick for the Playfair digraph substitution cipher.
 */
export default class PlayfairCipherEncoder extends Encoder {
  /**
   * Returns brick meta.
   * @return {object}
   */
  static getMeta () {
    return meta
  }

  /**
   * Constructor
   */
  constructor () {
    super()
    this.addSettings([
      {
        name: 'key',
        type: 'text',
        value: 'playfair',
        minLength: 0,
        caseSensitivity: false,
        randomizable: false
      },
      {
        name: 'filler',
        type: 'enum',
        value: 'x',
        elements: ['x', 'q'],
        labels: ['X', 'Q'],
        randomizable: false,
        style: 'radio'
      }
    ])
  }

  /**
   * Performs encode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performEncode (content) {
    const square = this.createSquare()
    const pairs = this.createPairs(content.getString())
    return this.translatePairs(pairs, square, 1)
  }

  /**
   * Performs decode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performDecode (content) {
    const square = this.createSquare()
    const text = this.normalize(content.getString())
    const pairs = []
    for (let i = 0; i < text.length; i += 2) {
      pairs.push([
        text[i],
        text[i + 1] || this.getSettingValue('filler')
      ])
    }
    return this.translatePairs(pairs, square, -1)
  }

  /**
   * Builds the keyed 5x5 square.
   * @return {string[]}
   */
  createSquare () {
    const key = this.normalize(this.getSettingValue('key').getString())
    const keyedAlphabet = []

    for (const character of key + alphabet) {
      if (keyedAlphabet.indexOf(character) === -1) {
        keyedAlphabet.push(character)
      }
    }

    return keyedAlphabet
  }

  /**
   * Normalizes Playfair input to the 25-character alphabet.
   * @param {string} value
   * @return {string}
   */
  normalize (value) {
    return value.toLowerCase()
      .replace(/j/g, 'i')
      .replace(/[^a-z]/g, '')
  }

  /**
   * Creates digraphs and inserts the configured filler where needed.
   * @param {string} value
   * @return {string[][]}
   */
  createPairs (value) {
    const text = this.normalize(value)
    const filler = this.getSettingValue('filler')
    const pairs = []
    let index = 0

    while (index < text.length) {
      const first = text[index]
      const second = text[index + 1]
      if (second === undefined) {
        pairs.push([first, filler])
        index++
      } else if (first === second) {
        pairs.push([first, filler])
        index++
      } else {
        pairs.push([first, second])
        index += 2
      }
    }

    return pairs
  }

  /**
   * Translates digraphs using Playfair row, column, and rectangle rules.
   * @param {string[][]} pairs
   * @param {string[]} square
   * @param {number} direction 1 for encode, -1 for decode
   * @return {string}
   */
  translatePairs (pairs, square, direction) {
    const result = []

    pairs.forEach(pair => {
      const first = square.indexOf(pair[0])
      const second = square.indexOf(pair[1])
      const firstRow = Math.floor(first / 5)
      const firstColumn = first % 5
      const secondRow = Math.floor(second / 5)
      const secondColumn = second % 5

      if (firstRow === secondRow) {
        result.push(square[firstRow * 5 +
          (firstColumn + direction + 5) % 5])
        result.push(square[secondRow * 5 +
          (secondColumn + direction + 5) % 5])
      } else if (firstColumn === secondColumn) {
        result.push(square[((firstRow + direction + 5) % 5) * 5 +
          firstColumn])
        result.push(square[((secondRow + direction + 5) % 5) * 5 +
          secondColumn])
      } else {
        result.push(square[firstRow * 5 + secondColumn])
        result.push(square[secondRow * 5 + firstColumn])
      }
    })

    return result.join('')
  }
}
