import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const html = readFileSync('dist/index.html', 'utf8')

assert.match(html, /<html lang="[a-z-]+">/, 'The document needs a language attribute')
assert.match(html, /<meta name="viewport"/, 'The document needs a viewport')
assert.match(html, /<title>[^<]+<\/title>/, 'The document needs a title')
assert.match(html, /aria-labelledby="app_logo"/, 'The logo needs an accessible label')
assert.match(html, /<button type="button" data-pipe-export>/, 'Export must be a labelled button')
assert.match(html, /<input type="file"[^>]*data-pipe-import>/, 'Import must expose a file input')
assert.match(html, /href="\/privacy"/, 'The privacy page must be reachable')

console.log('Accessibility smoke checks passed.')
