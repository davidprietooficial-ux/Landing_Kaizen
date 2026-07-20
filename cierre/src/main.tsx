import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme/tokens.css'
import './theme/base.css'
import './App.css'
import { App } from './App'
import { Gate } from './auth/Gate'
import { ErrorBoundary } from './ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Gate>
        <App />
      </Gate>
    </ErrorBoundary>
  </StrictMode>,
)
