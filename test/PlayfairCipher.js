import { describe } from 'mocha'

import EncoderTester from './Helper/EncoderTester.js'
import PlayfairCipherEncoder from '../src/Encoder/PlayfairCipher.js'

describe('PlayfairCipherEncoder', () => EncoderTester.test(
  PlayfairCipherEncoder,
  [
    {
      direction: 'encode',
      settings: { key: 'playfair example', filler: 'x' },
      content: 'hide the gold in the tree stump',
      expectedResult: 'bmodzbxdnabekudmuixmmouvif'
    },
    {
      direction: 'decode',
      settings: { key: 'playfair example', filler: 'x' },
      content: 'bmodzbxdnabekudmuixmmouvif',
      expectedResult: 'hidethegoldinthetrexestump'
    }
  ]
))
