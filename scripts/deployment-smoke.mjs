import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve('dist')
const requiredFiles = [
  'index.html',
  '404.html',
  'privacy.html',
  'offline.html',
  'site.css',
  'sw.js',
  'site.webmanifest',
  'favicon.svg',
  'schemas/pipe.json',
  'schemas/brick.json'
]

requiredFiles.forEach(file => assert(existsSync(resolve(dist, file)), `Missing dist/${file}`))

const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
const assets = [...html.matchAll(/(?:src|href)="(?:\.\/)?(assets\/[^"?]+)/g)].map(match => match[1])
assets.forEach(asset => assert(existsSync(resolve(dist, asset)), `Missing ${asset}`))
assert(html.includes('data-pipe-export'), 'Export control is missing')
assert(html.includes('data-pipe-import'), 'Import control is missing')

console.log(`Deployment smoke checks passed (${requiredFiles.length} static files, ${assets.length} bundled assets).`)
