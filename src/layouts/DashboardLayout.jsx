import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const DashboardLayout = () => {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">📄</div>
        <p className="text-gray-500">Loading...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  )
}

export default DashboardLayout