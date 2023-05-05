import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './components/auth/Auth.tsx'
import { Header } from './components/shared/Header.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter>
          <Header />
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  </React.StrictMode>,
)
