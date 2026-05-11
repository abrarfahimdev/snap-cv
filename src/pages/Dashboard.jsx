// ============================================
// DASHBOARD PAGE
// User dashboard with resumes and cover letters
// ============================================

import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Dashboard = () => {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [resumes, setResumes] = useState([])
  const [coverLetters, setCoverLetters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchResumes()
      fetchCoverLetters()
    }
  }, [user])

  const fetchResumes = async () => {
    const { data } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setResumes(data || [])
    setLoading(false)
  }

  const fetchCoverLetters = async () => {
    const { data } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setCoverLetters(data || [])
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'resumes', icon: '📄', label: 'My Resumes', count: resumes.length },
    { id: 'cover-letters', icon: '💌', label: 'Cover Letters', count: coverLetters.length },
    { id: 'profile', icon: '👤', label: 'Profile' },
  ]

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* ── SIDEBAR ─────────────────────────── */}
      <aside className="w-64 bg-white border-r border-gray-100 fixed top-0 left-0 h-screen flex flex-col z-50">

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold">S</div>
            <span className="text-xl font-black text-gray-900">Snap<span className="text-rose-500">CV</span></span>
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-base flex-shrink-0">
              {profile?.full_name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left ${
                activeTab === item.id
                  ? 'bg-rose-50 text-rose-500'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.count > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <span>🌐</span> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-all w-full text-left"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT ────────────────────── */}
      <main className="ml-64 flex-1 p-8">

        {/* ── OVERVIEW ──────────────────────── */}
        {activeTab === 'overview' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Here's your resume dashboard</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { icon: '📄', label: 'Resumes', value: resumes.length, color: 'bg-rose-50 text-rose-500' },
                { icon: '💌', label: 'Cover Letters', value: coverLetters.length, color: 'bg-blue-50 text-blue-500' },
                { icon: '📥', label: 'Downloads', value: 0, color: 'bg-green-50 text-green-500' },
                { icon: '⭐', label: 'Plan', value: profile?.plan || 'Free', color: 'bg-yellow-50 text-yellow-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 flex items-center gap-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-black text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { icon: '✨', title: 'Build New Resume', desc: 'Create a professional resume with AI', color: 'hover:border-rose-300', action: () => navigate('/build-resume') },
                { icon: '💌', title: 'Write Cover Letter', desc: 'Generate a tailored cover letter', color: 'hover:border-blue-300', action: () => setActiveTab('cover-letters') },
                { icon: '👤', title: 'Edit Profile', desc: 'Update your personal information', color: 'hover:border-green-300', action: () => setActiveTab('profile') },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={action.action}
                  className={`bg-white border-2 border-gray-100 ${action.color} rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg`}
                >
                  <span className="text-3xl block mb-3">{action.icon}</span>
                  <h3 className="font-bold text-gray-900 mb-1 text-sm">{action.title}</h3>
                  <p className="text-xs text-gray-400">{action.desc}</p>
                </button>
              ))}
            </div>

            {/* Recent Resumes */}
            {resumes.length > 0 && (
              <>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Resumes</h2>
                <div className="grid grid-cols-3 gap-4">
                  {resumes.slice(0, 3).map(resume => (
                    <Link
                      to={`/resume/${resume.id}`}
                      key={resume.id}
                      className="bg-white border border-gray-100 hover:border-rose-200 rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1 block"
                    >
                      <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl mb-4">📄</div>
                      <h3 className="font-bold text-gray-900 text-sm mb-1">{resume.title || resume.full_name}</h3>
                      <p className="text-xs text-gray-400 mb-4">{new Date(resume.created_at).toLocaleDateString()}</p>
                      <span className="text-xs bg-rose-50 text-rose-500 font-semibold px-3 py-1 rounded-full">
                        {resume.template || 'Modern'}
                      </span>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── RESUMES TAB ───────────────────── */}
        {activeTab === 'resumes' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">My Resumes 📄</h1>
                <p className="text-gray-500 mt-1">Manage your AI-generated resumes</p>
              </div>
              <Link
                to="/build-resume"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                + Build New Resume
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 animate-pulse">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl mb-4" />
                    <div className="h-4 bg-gray-100 rounded mb-2" />
                    <div className="h-3 bg-gray-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-6xl block mb-4">📄</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No resumes yet!</h3>
                <p className="text-gray-400 mb-6">Build your first AI-powered resume in 60 seconds.</p>
                <Link
                  to="/build-resume"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all inline-block"
                >
                  Build My Resume →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {resumes.map(resume => (
                  <div key={resume.id} className="bg-white border border-gray-100 hover:border-rose-200 rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl mb-4">📄</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{resume.title || resume.full_name}</h3>
                    <p className="text-xs text-gray-400 mb-4">{new Date(resume.created_at).toLocaleDateString()}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-rose-50 text-rose-500 font-semibold px-3 py-1 rounded-full">
                        {resume.template || 'Modern'}
                      </span>
                      <Link
                        to={`/resume/${resume.id}`}
                        className="text-xs text-gray-400 hover:text-rose-500 font-semibold transition-colors"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COVER LETTERS TAB ─────────────── */}
        {activeTab === 'cover-letters' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-black text-gray-900">Cover Letters 💌</h1>
                <p className="text-gray-500 mt-1">AI-generated cover letters for every job</p>
              </div>
              <Link
                to="/cover-letter"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                + Write Cover Letter
              </Link>
            </div>

            {coverLetters.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-6xl block mb-4">💌</span>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No cover letters yet!</h3>
                <p className="text-gray-400 mb-6">Generate a tailored cover letter for any job in seconds.</p>
                <Link
                  to="/cover-letter"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all inline-block"
                >
                  Write Cover Letter →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {coverLetters.map(cl => (
                  <div key={cl.id} className="bg-white border border-gray-100 hover:border-blue-200 rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4">💌</div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1">{cl.job_title}</h3>
                    <p className="text-xs text-gray-400 mb-1">{cl.company_name}</p>
                    <p className="text-xs text-gray-300 mb-4">{new Date(cl.created_at).toLocaleDateString()}</p>
                    <Link
                      to={`/cover-letter/${cl.id}`}
                      className="text-xs text-gray-400 hover:text-blue-500 font-semibold transition-colors"
                    >
                      View →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ───────────────────── */}
        {activeTab === 'profile' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-black text-gray-900">My Profile 👤</h1>
              <p className="text-gray-500 mt-1">Your account information</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-8 max-w-2xl">
              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                <div className="w-20 h-20 bg-rose-500 rounded-2xl flex items-center justify-center text-white font-black text-3xl">
                  {profile?.full_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900">{profile?.full_name}</h2>
                  <p className="text-gray-400">{user?.email}</p>
                  <span className="inline-block mt-2 bg-rose-50 text-rose-500 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                    {profile?.plan || 'Free'} Plan
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'Full Name', value: profile?.full_name || 'Not set' },
                  { label: 'Email', value: user?.email },
                  { label: 'Plan', value: profile?.plan || 'Free' },
                  { label: 'Member Since', value: new Date(user?.created_at).toLocaleDateString() },
                  { label: 'Resumes Created', value: resumes.length },
                  { label: 'Cover Letters', value: coverLetters.length },
                ].map((field, i) => (
                  <div key={i}>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{field.label}</p>
                    <p className="text-sm font-semibold text-gray-900">{field.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={handleLogout}
                className="mt-8 border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-semibold px-6 py-3 rounded-xl text-sm transition-all"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

export default Dashboard