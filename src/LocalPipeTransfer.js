const pipeSchema = 'https://cryptii.enkiel.org/schemas/pipe.json'

/**
 * Creates a portable, client-only pipe document.
 * @param {object} pipeData Serialized pipe data.
 * @return {object} Portable pipe document.
 */
export function exportPipe (pipeData) {
  if (pipeData === null || typeof pipeData !== 'object' || !Array.isArray(pipeData.items)) {
    throw new TypeError('Invalid pipe data.')
  }

  return Object.assign({ $schema: pipeSchema }, pipeData)
}

/**
 * Parses a portable pipe document.
 * @param {string} source JSON document.
 * @return {object} Serialized pipe data.
 */
export function importPipe (source) {
  let pipeData

  try {
    pipeData = JSON.parse(source)
  } catch (error) {
    throw new TypeError('The selected file is not valid JSON.')
  }

  if (pipeData === null || typeof pipeData !== 'object' || !Array.isArray(pipeData.items)) {
    throw new TypeError('The selected file is not a valid cryptii pipe.')
  }

  return pipeData
}
