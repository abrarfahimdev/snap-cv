import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './index.css'

// Layouts
import MainLayout from './layouts/MainLayout'
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import Login from './pages/LoginPage'
import Register from './pages/RegistrationPage'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import BuildResume from './pages/BuildResume'
import ViewResume from './pages/ViewResume'
import CoverLetter from './pages/CoverLetter'
import ViewCoverLetter from './pages/ViewCoverLetter'

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
    ]
  },
  {
    element: <DashboardLayout />,
    children: [
      { path: '/dashboard', element: <Dashboard /> },
      { path: '/build-resume', element: <BuildResume /> },
      { path: '/resume/:id', element: <ViewResume /> },
      { path: '/cover-letter', element: <CoverLetter /> },
      { path: '/cover-letter/:id', element: <ViewCoverLetter /> },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)