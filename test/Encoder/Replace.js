import { describe } from 'mocha'

import EncoderTester from '../Helper/EncoderTester.js'
import ReplaceEncoder from '../../src/Encoder/Replace.js'

/** @test {ReplaceEncoder} */
describe('ReplaceEncoder', () => EncoderTester.test(ReplaceEncoder, [
  {
    settings: {
      find: 'Foo',
      replace: 'This',
      caseSensitivity: false
    },
    direction: 'encode',
    content: 'Foo Bar foo bar Foo bar foo Bar',
    expectedResult: 'This Bar This bar This bar This Bar'
  },
  {
    settings: {
      find: 'Foo',
      replace: 'This',
      caseSensitivity: true
    },
    content: 'Foo Bar foo bar Foo bar foo Bar',
    expectedResult: 'This Bar foo bar This bar foo Bar'
  },
  {
    settings: {
      find: '🤣😃',
      replace: '😜😝',
      caseSensitivity: true
    },
    content: '😀😁😂🤣😃😄😅🤣😃😆😉😂😊',
    expectedResult: '😀😁😂😜😝😄😅😜😝😆😉😂😊'
  }
]))
