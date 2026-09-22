import { describe } from 'mocha'

import ByteEncoder from '../src/ByteEncoder.js'
import EncoderTester from './Helper/EncoderTester.js'
import HashEncoder from '../src/Encoder/Hash.js'

const bytes = ByteEncoder.bytesFromHexString

describe('HashEncoder BLAKE2s-256', () => EncoderTester.test(HashEncoder, [
  {
    settings: { algorithm: 'blake2s-256' },
    direction: 'encode',
    content: '',
    expectedResult: bytes(
      '69217a3079908094e11121d042354a7c' +
      '1f55b6482ca1a51e1b250dfd1ed0eef9')
  },
  {
    settings: { algorithm: 'blake2s-256' },
    direction: 'encode',
    content: 'abc',
    expectedResult: bytes(
      '508c5e8c327c14e2e1a72ba34eeb452f' +
      '37458b209ed63a294d999b4c86675982')
  }
]))
