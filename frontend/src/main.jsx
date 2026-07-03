import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/DateInput.css'
import './styles/Avatars.css'
import App from './App.jsx'
import AuthProvider, { AuthContext } from './contexts/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App/>
  </AuthProvider>
)
