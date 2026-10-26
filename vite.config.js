import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const pagesFile = (name) => fileURLToPath(new URL(`./src/${name}`, import.meta.url))

// https://vite.dev/config/
// '#pages' is the list of site pages: lazy-loaded in the browser, plain imports for the
// build-time render that writes each page's HTML (so that HTML contains the real content).
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  // scripts/prerender.mjs reads the manifest to link each page's own JS and CSS in its HTML
  build: { manifest: true },
  resolve: {
    alias: { '#pages': pagesFile(isSsrBuild ? 'pages.static.jsx' : 'pages.lazy.jsx') },
  },
}))
