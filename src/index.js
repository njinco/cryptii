import '../style/index.scss'
import App from './App.js'
import EnvUtil from './EnvUtil.js'
import { exportPipe, importPipe } from './LocalPipeTransfer.js'

export { App }
export { EnvUtil }
export { exportPipe, importPipe }

export { default as ArrayUtil } from './ArrayUtil'
export { default as Brick } from './Brick'
export { default as BrickFactory } from './Factory/Brick'
export { default as ByteEncoder } from './ByteEncoder'
export { default as ByteEncodingError } from './Error/ByteEncoding'
export { default as Chain } from './Chain'
export { default as Encoder } from './Encoder'
export { default as EventManager } from './EventManager'
export { default as Factory } from './Factory'
export { default as Field } from './Field'
export { default as FieldFactory } from './Factory/Field'
export { default as Form } from './Form'
export { default as GenericError } from './GenericError'
export { default as InvalidInputError } from './Error/InvalidInput'
export { default as LibraryModalView } from './View/Modal/Library'
export { default as MathUtil } from './MathUtil'
export { default as ModalView } from './View/Modal'
export { default as Pipe } from './Pipe'
export { default as Random } from './Random'
export { default as StringUtil } from './StringUtil'
export { default as TextEncoder } from './TextEncoder'
export { default as TextEncodingError } from './Error/TextEncoding'
export { default as View } from './View'
export { default as Viewable } from './Viewable'
export { default as Viewer } from './Viewer'

// Check if we are running in the browser and if the init flag is set
if (EnvUtil.isBrowser() &&
    document.querySelector('script[data-cryptii-config]') !== null) {
  // Define app initialization in the browser
  const init = () => {
    // Read optional pipe content
    const $pipeData = document.querySelector('script[data-cryptii-pipe]')
    const pipeData = $pipeData !== null ? JSON.parse($pipeData.innerHTML) : null

    // Read optional app config
    const $config = document.querySelector('script[data-cryptii-config]')
    const config = $config !== null ? JSON.parse($config.innerHTML) : {}

    // Configure app and bootstrap it
    const storedPipe = window.sessionStorage.getItem('cryptii-imported-pipe')
    if (storedPipe !== null) window.sessionStorage.removeItem('cryptii-imported-pipe')

    const app = new App(config)
    app.run(storedPipe === null ? pipeData : importPipe(storedPipe))

    const exportButton = document.querySelector('[data-pipe-export]')
    const importInput = document.querySelector('[data-pipe-import]')

    exportButton.addEventListener('click', () => {
      const documentData = exportPipe(app.getPipe().serialize())
      const blob = new Blob([JSON.stringify(documentData, null, 2)], {
        type: 'application/json'
      })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'cryptii-pipe.json'
      link.click()
      URL.revokeObjectURL(link.href)
    })

    importInput.addEventListener('change', async () => {
      const file = importInput.files[0]
      if (file === undefined) return

      try {
        const pipe = importPipe(await file.text())
        window.sessionStorage.setItem('cryptii-imported-pipe', JSON.stringify(pipe))
        window.location.reload()
      } catch (error) {
        window.alert(error.message)
        importInput.value = ''
      }
    })
  }

  // Trigger initialization when the DOM is ready
  if (document.readyState !== 'loading') {
    init()
  } else {
    window.addEventListener('DOMContentLoaded', init)
  }
}
