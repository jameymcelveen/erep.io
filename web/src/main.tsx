import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { MockReviewProvider } from '@/providers/MockReviewProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MockReviewProvider>
      <App />
    </MockReviewProvider>
  </StrictMode>,
)
