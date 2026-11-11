import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { StyledEngineProvider } from '@mui/material/styles'
import GlobalStyles from '@mui/material/GlobalStyles'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StyledEngineProvider enableCssLayer>
      <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StyledEngineProvider>
  </StrictMode>,
)
