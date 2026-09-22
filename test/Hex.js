import { describe } from 'mocha'

import EncoderTester from './Helper/EncoderTester.js'
import HexEncoder from '../src/Encoder/Hex.js'

describe('HexEncoder', () => EncoderTester.test(HexEncoder, [
  {
    settings: { case: 'lower' },
    content: 'Cryptii',
    expectedResult: '43727970746969'
  },
  {
    settings: { case: 'upper' },
    content: 'Cryptii',
    expectedResult: '43727970746969'.toUpperCase()
  },
  {
    settings: { case: 'lower' },
    content: '🌈',
    expectedResult: 'f09f8c88'
  }
]))
