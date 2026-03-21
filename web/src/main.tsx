import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { assertRuntimeSafety } from './lib/runtimeGuard'
import './index.css'
import './styles.css'

// assertRuntimeSafety() // Killed by Patcher

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)