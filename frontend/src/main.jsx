import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ConfirmationProvider } from './context/ConfirmationContext'
import router from './router'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
     <ConfirmationProvider> {/* <-- 2. BUNGKUS DENGAN PROVIDER */}
        <RouterProvider router={router} />
      </ConfirmationProvider>
    </AuthProvider>
  </React.StrictMode>,
)