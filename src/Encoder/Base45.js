import Encoder from '../Encoder.js'
import InvalidInputError from '../Error/InvalidInput.js'

const meta = {
  name: 'base45',
  title: 'Base45',
  category: 'Encoding',
  type: 'encoder'
}

const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'

/**
 * Encoder brick for RFC 9285 Base45.
 */
export default class Base45Encoder extends Encoder {
  /**
   * Returns brick meta.
   * @return {object}
   */
  static getMeta () {
    return meta
  }

  /**
   * Performs encode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performEncode (content) {
    const bytes = content.getBytes()
    const result = []

    for (let i = 0; i < bytes.length; i += 2) {
      if (i + 1 < bytes.length) {
        const value = bytes[i] * 256 + bytes[i + 1]
        result.push(
          alphabet[value % 45],
          alphabet[Math.floor(value / 45) % 45],
          alphabet[Math.floor(value / 2025)])
      } else {
        const value = bytes[i]
        result.push(alphabet[value % 45], alphabet[Math.floor(value / 45)])
      }
    }

    return result.join('')
  }

  /**
   * Performs decode on given content.
   * @protected
   * @param {Chain} content
   * @return {Uint8Array}
   */
  performDecode (content) {
    // Spaces are part of the Base45 alphabet and must be preserved.
    const string = content.getString()
    if (string.length % 3 === 1) {
      throw new InvalidInputError(
        'Base45 input must contain groups of two or three characters')
    }

    const bytes = []
    let i = 0
    while (i < string.length) {
      const remaining = string.length - i
      const first = this.getCharacterValue(string[i], i)
      const second = this.getCharacterValue(string[i + 1], i + 1)

      if (remaining === 2) {
        const value = first + second * 45
        if (value > 255) {
          throw new InvalidInputError('Base45 pair decodes outside a byte')
        }
        bytes.push(value)
        break
      }

      const third = this.getCharacterValue(string[i + 2], i + 2)
      const value = first + second * 45 + third * 2025
      if (value > 65535) {
        throw new InvalidInputError('Base45 group decodes outside two bytes')
      }
      bytes.push(Math.floor(value / 256), value % 256)
      i += 3
    }

    return new Uint8Array(bytes)
  }

  /**
   * Returns the Base45 value for a character.
   * @param {string} character
   * @param {number} index
   * @return {number}
   */
  getCharacterValue (character, index) {
    const value = alphabet.indexOf(character)
    if (value === -1) {
      throw new InvalidInputError(
        `Invalid Base45 character '${character}' at index ${index}`)
    }
    return value
  }
}
