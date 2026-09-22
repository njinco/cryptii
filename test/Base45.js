import assert from 'assert'
import { describe, it } from 'mocha'

import EncoderTester from './Helper/EncoderTester.js'
import Base45Encoder from '../src/Encoder/Base45.js'

describe('Base45Encoder', () => {
  EncoderTester.test(Base45Encoder, [
    {
      content: 'Hello!!',
      expectedResult: '%69 VD92EX0'
    },
    {
      content: 'ietf',
      expectedResult: 'QED8WE'
    }
  ])

  it('should reject invalid input length', async () => {
    const encoder = new Base45Encoder()
    await assert.rejects(() => encoder.decode('0'))
  })
})
