import ByteEncoder from '../ByteEncoder.js'
import Encoder from '../Encoder.js'

const meta = {
  name: 'hex',
  title: 'Hexadecimal',
  category: 'Encoding',
  type: 'encoder'
}

/**
 * Encoder brick for hexadecimal byte strings.
 */
export default class HexEncoder extends Encoder {
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
      name: 'case',
      type: 'enum',
      value: 'lower',
      elements: ['lower', 'upper'],
      labels: ['Lowercase (a-f)', 'Uppercase (A-F)'],
      randomizable: false,
      style: 'radio'
    })
  }

  /**
   * Performs encode on given content.
   * @protected
   * @param {Chain} content
   * @return {string}
   */
  performEncode (content) {
    const result = ByteEncoder.hexStringFromBytes(content.getBytes())
    return this.getSettingValue('case') === 'upper'
      ? result.toUpperCase()
      : result
  }

  /**
   * Performs decode on given content.
   * @protected
   * @param {Chain} content
   * @return {Uint8Array}
   */
  performDecode (content) {
    return ByteEncoder.bytesFromHexString(content.getString())
  }
}
