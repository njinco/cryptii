import { describe } from 'mocha'

import EncoderTester from './Helper/EncoderTester.js'
import ColumnarTranspositionCipherEncoder from
  '../src/Encoder/ColumnarTranspositionCipher.js'

describe('ColumnarTranspositionCipherEncoder', () => EncoderTester.test(
  ColumnarTranspositionCipherEncoder,
  [
    {
      settings: { key: 'zebras' },
      content: 'WEAREDISCOVEREDFLEEATONCE',
      expectedResult: 'EVLNACDTESEAROFODEECWIREE'
    },
    {
      settings: { key: 'cargo' },
      content: 'Short text with uneven columns.',
      direction: 'encode',
      expectedResult: 'htwunuS   el.rxtecntthvosoein m'
    }
  ]
))
