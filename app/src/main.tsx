import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Calculator from './Calculator.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Calculator />
  </StrictMode>,
)
