// ============================================
// VIEW COVER LETTER PAGE
// Display and copy cover letter
// ============================================

import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const ViewCoverLetter = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [coverLetter, setCoverLetter] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const contentRef = useRef()

  useEffect(() => {
    fetchCoverLetter()
  }, [id])

  const fetchCoverLetter = async () => {
    try {
      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      setCoverLetter(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">💌</div>
        <p className="text-gray-500">Loading cover letter...</p>
      </div>
    </div>
  )

  if (!coverLetter) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Cover letter not found</h2>
        <Link to="/dashboard" className="text-rose-500 font-semibold">← Back to Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── TOP BAR ─────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 font-semibold text-sm transition-colors"
            >
              ← Dashboard
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <h1 className="font-black text-gray-900 text-sm">
              {coverLetter.job_title} — {coverLetter.company_name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/cover-letter"
              className="border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              + New Cover Letter
            </Link>
            <button
              onClick={handleCopy}
              className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              {copied ? '✅ Copied!' : '📋 Copy Text'}
            </button>
            <button
              onClick={handlePrint}
              className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      </div>

      {/* ── COVER LETTER ────────────────────── */}
      <div className="max-w-3xl mx-auto py-10 px-6">
        <div
          ref={contentRef}
          className="bg-white shadow-2xl rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-rose-500 px-10 py-8 text-white">
            <h1 className="text-2xl font-black mb-1">{coverLetter.job_title}</h1>
            <p className="text-rose-100">{coverLetter.company_name}</p>
            <p className="text-rose-200 text-sm mt-2">
              {new Date(coverLetter.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          {/* Content */}
          <div className="px-10 py-8">
            <div className="prose max-w-none">
              {coverLetter.content.split('\n').map((paragraph, i) => (
                paragraph.trim() ? (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4 text-sm">
                    {paragraph}
                  </p>
                ) : (
                  <br key={i} />
                )
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 print:hidden">
            <div className="flex gap-3">
              <button
                onClick={handleCopy}
                className="flex-1 border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-semibold py-3 rounded-xl text-sm transition-all"
              >
                {copied ? '✅ Copied!' : '📋 Copy Text'}
              </button>
              <button
                onClick={handlePrint}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 rounded-xl text-sm transition-all"
              >
                🖨️ Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ViewCoverLetter