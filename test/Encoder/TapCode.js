import { describe } from 'mocha'

import EncoderTester from '../Helper/EncoderTester.js'
import TapCodeEncoder from '../../src/Encoder/TapCode.js'

/** @test {TapCodeEncoder} */
describe('TapCodeEncoder', () => EncoderTester.test(TapCodeEncoder, [
  {
    content: 'thequiccbrownfoxjumpsoverthelazydog',
    expectedResult:
      '.... ....  .. ...  . .....  .... .  .... .....  .. ....  . ...  ' +
      '. ...  . ..  .... ..  ... ....  ..... ..  ... ...  .. .  ... ....  ' +
      '..... ...  .. .....  .... .....  ... ..  ... .....  .... ...  ' +
      '... ....  ..... .  . .....  .... ..  .... ....  .. ...  . .....  ' +
      '... .  . .  ..... .....  ..... ....  . ....  ... ....  .. ..'
  },
  {
    // Wikipedia example
    content: 'water',
    expectedResult: '..... ..  . .  .... ....  . .....  .... ..'
  }
]))
