import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initRouter, splitLocation } from './utils/router'
import { getPage, isKnownPath } from './utils/pages'
import { preloadAllPages, preloadPage } from '#pages'

initRouter(isKnownPath)

// The page arrives pre-rendered for search engines. Download this page's code first, so the
// pre-rendered content stays on screen until the app can replace it (no blank flash).
const { path } = splitLocation(window.location.pathname)
const start = () => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  preloadAllPages()
}
preloadPage(getPage(path)).then(start, start)
