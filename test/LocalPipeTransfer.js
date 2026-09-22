import assert from 'assert'
import { describe, it } from 'mocha'
import { exportPipe, importPipe } from '../src/LocalPipeTransfer.js'

describe('LocalPipeTransfer', () => {
  const pipe = { items: [{ name: 'text' }], content: { data: 'hello' } }

  it('exports a portable pipe document', () => {
    assert.strictEqual(exportPipe(pipe).$schema, 'https://cryptii.enkiel.org/schemas/pipe.json')
    assert.deepStrictEqual(exportPipe(pipe).items, pipe.items)
  })

  it('imports a valid pipe document', () => {
    assert.deepStrictEqual(importPipe(JSON.stringify(pipe)), pipe)
  })

  it('rejects invalid pipe documents', () => {
    assert.throws(() => importPipe('{"items": null}'), /valid cryptii pipe/)
    assert.throws(() => importPipe('not json'), /valid JSON/)
  })
})
