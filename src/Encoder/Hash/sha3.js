const mask = 0xffffffffffffffffn
const rate = 136

const roundConstants = [
  0x0000000000000001n, 0x0000000000008082n,
  0x800000000000808an, 0x8000000080008000n,
  0x000000000000808bn, 0x0000000080000001n,
  0x8000000080008081n, 0x8000000000008009n,
  0x000000000000008an, 0x0000000000000088n,
  0x0000000080008009n, 0x000000008000000an,
  0x000000008000808bn, 0x800000000000008bn,
  0x8000000000008089n, 0x8000000000008003n,
  0x8000000000008002n, 0x8000000000000080n,
  0x000000000000800an, 0x800000008000000an,
  0x8000000080008081n, 0x8000000000008080n,
  0x0000000080000001n, 0x8000000080008008n
]

const rotationOffsets = [
  0, 1, 62, 28, 27,
  36, 44, 6, 55, 20,
  3, 10, 43, 25, 39,
  41, 45, 15, 21, 8,
  18, 2, 61, 56, 14
]

function rotateLeft (value, offset) {
  if (offset === 0) {
    return value
  }
  return ((value << BigInt(offset)) |
    (value >> BigInt(64 - offset))) & mask
}

function permute (state) {
  for (const roundConstant of roundConstants) {
    const columnParity = new Array(5).fill(0n)
    const delta = new Array(5)
    const temporary = new Array(25)

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        columnParity[x] ^= state[x + y * 5]
      }
    }
    for (let x = 0; x < 5; x++) {
      delta[x] = columnParity[(x + 4) % 5] ^
        rotateLeft(columnParity[(x + 1) % 5], 1)
    }
    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        state[x + y * 5] ^= delta[x]
      }
    }

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const source = x + y * 5
        const targetX = y
        const targetY = (2 * x + 3 * y) % 5
        temporary[targetX + targetY * 5] = rotateLeft(
          state[source], rotationOffsets[source])
      }
    }

    for (let x = 0; x < 5; x++) {
      for (let y = 0; y < 5; y++) {
        const index = x + y * 5
        state[index] = temporary[index] ^
          ((~temporary[(x + 1) % 5 + y * 5]) &
           temporary[(x + 2) % 5 + y * 5])
      }
    }

    state[0] ^= roundConstant
  }
}

/**
 * Creates a SHA3-256 message digest.
 * @param {Uint8Array} input Bytes to be encoded
 * @return {Uint8Array} SHA3-256 digest
 */
export default function sha3 (input) {
  const bytes = Array.from(input)
  bytes.push(0x06)
  while (bytes.length % rate !== rate - 1) {
    bytes.push(0)
  }
  bytes.push(0x80)

  const state = new Array(25).fill(0n)
  for (let offset = 0; offset < bytes.length; offset += rate) {
    for (let lane = 0; lane < rate / 8; lane++) {
      let value = 0n
      for (let byte = 0; byte < 8; byte++) {
        value |= BigInt(bytes[offset + lane * 8 + byte]) <<
          BigInt(byte * 8)
      }
      state[lane] ^= value
    }
    permute(state)
  }

  const digest = new Uint8Array(32)
  for (let i = 0; i < digest.length; i++) {
    digest[i] = Number((state[Math.floor(i / 8)] >>
      BigInt((i % 8) * 8)) & 0xffn)
  }
  return digest
}
