import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')

      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match!')
        return
      }

      if (form.password.length < 6) {
        setError('Password must be at least 6 characters!')
        return
      }

      setLoading(true)
      const { error } = await signUp(form.email, form.password, form.fullName)
      if (error) throw error
      setSuccess(true)

    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">Account Created!</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please check your email to confirm your account then login.
          </p>
          <Link
            to="/login"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 px-8 rounded-xl text-sm transition-all inline-block"
          >
            Go to Login →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl p-10">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="text-2xl font-black text-gray-900">
              Snap<span className="text-rose-500">CV</span>
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500 text-sm">Join SnapCV and build your perfect resume</p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm mb-6">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Your full name"
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                required
className="bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
className="bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <input
                type="password"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
className="bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                value={form.confirmPassword}
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                required
className="bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200 hover:-translate-y-0.5 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Account 🚀'}
            </button>
          </form>

          {/* Links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-500 font-semibold hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Register