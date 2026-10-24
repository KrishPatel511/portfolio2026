import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initRouter } from './utils/router'
import { isKnownPath } from './utils/pages'

initRouter(isKnownPath)

// The page arrives pre-rendered for search engines; the app replaces it once it loads.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
