const initializationVector = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]

const sigma = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  [14, 10, 4, 8, 9, 15, 13, 6, 1, 12, 0, 2, 11, 7, 5, 3],
  [11, 8, 12, 0, 5, 2, 15, 13, 10, 14, 3, 6, 7, 1, 9, 4],
  [7, 9, 3, 1, 13, 12, 11, 14, 2, 6, 5, 10, 4, 0, 15, 8],
  [9, 0, 5, 7, 2, 4, 10, 15, 14, 1, 11, 12, 6, 8, 3, 13],
  [2, 12, 6, 10, 0, 11, 8, 3, 4, 13, 7, 5, 15, 14, 1, 9],
  [12, 5, 1, 15, 14, 13, 4, 10, 0, 7, 6, 3, 9, 2, 8, 11],
  [13, 11, 7, 14, 12, 1, 3, 9, 5, 0, 15, 4, 8, 6, 2, 10],
  [6, 15, 14, 9, 11, 3, 0, 8, 12, 2, 13, 7, 1, 4, 10, 5],
  [10, 2, 8, 4, 7, 6, 1, 5, 15, 11, 9, 14, 3, 12, 13, 0]
]

function rotateRight (value, bits) {
  return (value >>> bits) | (value << (32 - bits))
}

function mix (state, a, b, c, d, x, y) {
  state[a] = (state[a] + state[b] + x) >>> 0
  state[d] = rotateRight(state[d] ^ state[a], 16)
  state[c] = (state[c] + state[d]) >>> 0
  state[b] = rotateRight(state[b] ^ state[c], 12)
  state[a] = (state[a] + state[b] + y) >>> 0
  state[d] = rotateRight(state[d] ^ state[a], 8)
  state[c] = (state[c] + state[d]) >>> 0
  state[b] = rotateRight(state[b] ^ state[c], 7)
}

function compress (hash, block, counter, last) {
  const message = new Uint32Array(16)
  for (let i = 0; i < 16; i++) {
    message[i] = block[i * 4] |
      block[i * 4 + 1] << 8 |
      block[i * 4 + 2] << 16 |
      block[i * 4 + 3] << 24
  }

  const state = hash.concat(initializationVector)
  state[12] ^= counter
  if (last) {
    state[14] = ~state[14]
  }

  for (const round of sigma) {
    mix(state, 0, 4, 8, 12, message[round[0]], message[round[1]])
    mix(state, 1, 5, 9, 13, message[round[2]], message[round[3]])
    mix(state, 2, 6, 10, 14, message[round[4]], message[round[5]])
    mix(state, 3, 7, 11, 15, message[round[6]], message[round[7]])
    mix(state, 0, 5, 10, 15, message[round[8]], message[round[9]])
    mix(state, 1, 6, 11, 12, message[round[10]], message[round[11]])
    mix(state, 2, 7, 8, 13, message[round[12]], message[round[13]])
    mix(state, 3, 4, 9, 14, message[round[14]], message[round[15]])
  }

  for (let i = 0; i < 8; i++) {
    hash[i] ^= state[i] ^ state[i + 8]
  }
}

/**
 * Creates a BLAKE2s-256 message digest.
 * @param {Uint8Array} input Bytes to be encoded
 * @return {Uint8Array} BLAKE2s-256 digest
 */
export default function blake2s (input) {
  const bytes = Array.from(input)
  const hash = initializationVector.slice()
  hash[0] ^= 0x01010020

  let offset = 0
  while (offset + 64 < bytes.length) {
    compress(hash, bytes.slice(offset, offset + 64), offset + 64, false)
    offset += 64
  }

  const block = new Array(64).fill(0)
  block.splice(0, bytes.length - offset, ...bytes.slice(offset))
  compress(hash, block, bytes.length, true)

  const digest = new Uint8Array(32)
  for (let i = 0; i < digest.length; i++) {
    digest[i] = (hash[Math.floor(i / 4)] >> ((i % 4) * 8)) & 0xff
  }
  return digest
}
