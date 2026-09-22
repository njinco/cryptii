import { describe } from 'mocha'

import EncoderTester from './Helper/EncoderTester.js'
import Base58Encoder from '../src/Encoder/Base58.js'

describe('Base58Encoder', () => EncoderTester.test(Base58Encoder, [
  {
    content: '',
    expectedResult: ''
  },
  {
    content: 'Hello World',
    expectedResult: 'JxF12TrwUP45BMd'
  },
  {
    content: '\u0000\u0000\u0001',
    expectedResult: '112'
  },
  {
    content: '\u0000\u0000',
    expectedResult: '11'
  }
]))
