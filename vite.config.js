import { defineConfig } from 'vite'

export default defineConfig({
  base: '',
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  },
  build: {
    outDir: 'dist',
    manifest: 'manifest.json'
  },
  plugins: [
    {
      name: 'remove-attributes',
      transformIndexHtml: (html) =>
        html.replaceAll(/( type="module")? crossorigin/g, '')
    }
  ]
})
