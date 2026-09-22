import { describe } from 'mocha'

import ByteEncoder from '../src/ByteEncoder.js'
import EncoderTester from './Helper/EncoderTester.js'
import BlockCipherEncoder from '../src/Encoder/BlockCipher.js'

const bytes = ByteEncoder.bytesFromHexString

describe('BlockCipherEncoder AES-GCM', () => EncoderTester.test(
  BlockCipherEncoder,
  {
    settings: {
      algorithm: 'aes-128',
      mode: 'gcm',
      key: bytes('00000000000000000000000000000000'),
      iv: bytes('000000000000000000000000')
    },
    content: bytes('00000000000000000000000000000000'),
    expectedResult: bytes(
      '0388dace60b6a392f328c2b971b2fe78' +
      'ab6e47d42cec13bdf53a67b21257bddf')
  }
))
