import { renderToString } from 'react-dom/server'
import App from './App.jsx'
import { setServerPath } from './utils/router'

/* Renders one page to an HTML string at build time (see scripts/prerender.mjs). */
export function render(path) {
  setServerPath(path)
  return renderToString(<App />)
}
