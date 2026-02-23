import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppWrapper from './App.jsx' // Note the changed import name

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);