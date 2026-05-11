import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
            S
          </div>
          <span className="text-xl font-black text-gray-900">
            Snap<span className="text-rose-500">CV</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link to="/#features" className="text-gray-500 hover:text-rose-500 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all text-sm">
            Features
          </Link>
          <Link to="/#pricing" className="text-gray-500 hover:text-rose-500 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all text-sm">
            Pricing
          </Link>
          <Link to="/#how" className="text-gray-500 hover:text-rose-500 font-medium px-4 py-2 rounded-lg hover:bg-rose-50 transition-all text-sm">
            How It Works
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 hover:text-rose-500 font-semibold text-sm transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5">
                Start Free →
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-rose-500 font-semibold text-sm transition-colors">
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden border border-gray-200 rounded-lg w-10 h-10 flex items-center justify-center text-gray-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 py-4 flex flex-col gap-2">
          <Link to="/#features" className="text-gray-600 font-medium py-2">Features</Link>
          <Link to="/#pricing" className="text-gray-600 font-medium py-2">Pricing</Link>
          <Link to="/#how" className="text-gray-600 font-medium py-2">How It Works</Link>
          {!user ? (
            <>
              <Link to="/login" className="text-gray-600 font-medium py-2">Login</Link>
              <Link to="/register" className="bg-rose-500 text-white font-semibold px-5 py-3 rounded-xl text-center">
                Start Free →
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 font-medium py-2">Dashboard</Link>
              <button onClick={handleLogout} className="bg-rose-500 text-white font-semibold px-5 py-3 rounded-xl text-left">
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar