import { describe } from 'mocha'

import ByteEncoder from '../src/ByteEncoder.js'
import EncoderTester from './Helper/EncoderTester.js'
import HashEncoder from '../src/Encoder/Hash.js'

const bytes = ByteEncoder.bytesFromHexString

describe('HashEncoder SHA3-256', () => EncoderTester.test(HashEncoder, [
  {
    settings: { algorithm: 'sha3-256' },
    direction: 'encode',
    content: '',
    expectedResult: bytes(
      'a7ffc6f8bf1ed76651c14756a061d662' +
      'f580ff4de43b49fa82d80a4b80f8434a')
  },
  {
    settings: { algorithm: 'sha3-256' },
    direction: 'encode',
    content: 'abc',
    expectedResult: bytes(
      '3a985da74fe225b2045c172d6bd390bd' +
      '855f086e3e9d525b46bfe24511431532')
  }
]))
