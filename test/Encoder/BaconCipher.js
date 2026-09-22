import { describe } from 'mocha'

import EncoderTester from '../Helper/EncoderTester.js'
import BaconCipherEncoder from '../../src/Encoder/BaconCipher.js'

/** @test {BaconCipherEncoder} */
describe('BaconCipherEncoder', () => EncoderTester.test(BaconCipherEncoder, [
  {
    content: 'thequickbrownfoxiumpsouerthelazydog',
    expectedResult:
      'baaba aabbb aabaa abbbb baabb abaaa aaaba abaab aaaab baaaa abbab ' +
      'babaa abbaa aabab abbab babab abaaa baabb ababb abbba baaab abbab ' +
      'baabb aabaa baaaa baaba aabbb aabaa ababa aaaaa babbb babba aaabb ' +
      'abbab aabba'
  },
  {
    settings: { variant: 'unique', aMark: '.', bMark: ',' },
    content: 'thequickbrownfoxjumpsoverthelazydog',
    expectedResult:
      ',..,, ..,,, ..,.. ,.... ,.,.. .,... ...,. .,.,. ...., ,..., .,,,. ' +
      ',.,,. .,,., ..,., .,,,. ,.,,, .,.., ,.,.. .,,.. .,,,, ,..,. .,,,. ' +
      ',.,., ..,.. ,..., ,..,, ..,,, ..,.. .,.,, ..... ,,.., ,,... ...,, ' +
      '.,,,. ..,,.'
  }
]))
