import Encoder from '../Encoder.js'

const meta = {
  name: 'columnar-transposition-cipher',
  title: 'Columnar transposition cipher',
  category: 'Ciphers',
  type: 'encoder'
}

/**
 * Encoder brick for columnar transposition.
 */
export default class ColumnarTranspositionCipherEncoder extends Encoder {
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
    this.addSetting({
      name: 'key',
      type: 'text',
      value: 'zebras',
      uniqueChars: true,
      minLength: 2,
      caseSensitivity: false,
      randomizable: false
    })
  }

  /**
   * Performs encode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performEncode (content) {
    const text = content.getString()
    const keyOrder = this.getKeyOrder()
    const columnCount = keyOrder.length
    const result = []

    keyOrder.forEach(column => {
      for (let index = column; index < text.length; index += columnCount) {
        result.push(text[index])
      }
    })

    return result.join('')
  }

  /**
   * Performs decode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performDecode (content) {
    const text = content.getString()
    const keyOrder = this.getKeyOrder()
    const columnCount = keyOrder.length
    const rowCount = Math.ceil(text.length / columnCount)
    const remainder = text.length % columnCount
    const columns = new Array(columnCount)
    let offset = 0

    keyOrder.forEach(column => {
      const columnLength = rowCount - (remainder !== 0 && column >= remainder ? 1 : 0)
      columns[column] = text.slice(offset, offset + columnLength)
      offset += columnLength
    })

    const result = []
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columnCount; column++) {
        if (columns[column][row] !== undefined) {
          result.push(columns[column][row])
        }
      }
    }

    return result.join('')
  }

  /**
   * Returns original column indexes sorted by key character.
   * @return {number[]}
   */
  getKeyOrder () {
    const key = this.getSettingValue('key').getString().toLowerCase()
    return Array.from(key)
      .map((character, index) => ({ character, index }))
      .sort((first, second) => first.character.localeCompare(second.character))
      .map(item => item.index)
  }
}
