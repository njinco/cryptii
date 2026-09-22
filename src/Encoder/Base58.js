import Encoder from '../Encoder.js'
import InvalidInputError from '../Error/InvalidInput.js'
import StringUtil from '../StringUtil.js'

const meta = {
  name: 'base58',
  title: 'Base58',
  category: 'Encoding',
  type: 'encoder'
}

const alphabet =
  '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

/**
 * Encoder brick for the Bitcoin Base58 encoding.
 */
export default class Base58Encoder extends Encoder {
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
    if (bytes.length === 0) {
      return ''
    }

    let zeroCount = 0
    while (zeroCount < bytes.length && bytes[zeroCount] === 0) {
      zeroCount++
    }

    if (zeroCount === bytes.length) {
      return '1'.repeat(zeroCount)
    }

    const digits = [0]
    for (let i = zeroCount; i < bytes.length; i++) {
      let carry = bytes[i]
      for (let j = 0; j < digits.length; j++) {
        carry += digits[j] << 8
        digits[j] = carry % 58
        carry = Math.floor(carry / 58)
      }
      while (carry > 0) {
        digits.push(carry % 58)
        carry = Math.floor(carry / 58)
      }
    }

    return '1'.repeat(zeroCount) +
      digits.reverse().map(digit => alphabet[digit]).join('')
  }

  /**
   * Performs decode on given content.
   * @protected
   * @param {Chain} content
   * @return {Uint8Array}
   */
  performDecode (content) {
    const string = StringUtil.removeWhitespaces(content.getString())
    if (string.length === 0) {
      return new Uint8Array([])
    }

    let zeroCount = 0
    while (zeroCount < string.length && string[zeroCount] === '1') {
      zeroCount++
    }

    if (zeroCount === string.length) {
      return new Uint8Array(new Array(zeroCount).fill(0))
    }

    const bytes = [0]
    for (let i = zeroCount; i < string.length; i++) {
      const value = alphabet.indexOf(string[i])
      if (value === -1) {
        throw new InvalidInputError(
          `Invalid Base58 character '${string[i]}' at index ${i}`)
      }

      let carry = value
      for (let j = 0; j < bytes.length; j++) {
        carry += bytes[j] * 58
        bytes[j] = carry & 0xff
        carry >>= 8
      }
      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    return new Uint8Array(
      new Array(zeroCount).fill(0).concat(bytes.reverse()))
  }
}
