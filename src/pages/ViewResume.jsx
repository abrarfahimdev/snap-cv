// ============================================
// VIEW RESUME PAGE
// Display and download the generated resume
// ============================================

import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

const ViewResume = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const resumeRef = useRef()
  const [resume, setResume] = useState(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    fetchResume()
  }, [id])

  const fetchResume = async () => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      setResume(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Download as PDF
  const downloadPDF = async () => {
    try {
      setDownloading(true)
      const html2pdf = (await import('html2pdf.js')).default
      const element = resumeRef.current
      const opt = {
        margin: 0,
        filename: `${resume.full_name}-Resume.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }
      await html2pdf().set(opt).from(element).save()
    } catch (err) {
      console.error(err)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-spin">📄</div>
        <p className="text-gray-500">Loading resume...</p>
      </div>
    </div>
  )

  if (!resume) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Resume not found</h2>
        <Link to="/dashboard" className="text-rose-500 font-semibold">← Back to Dashboard</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ── TOP BAR ─────────────────────────── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700 font-semibold text-sm transition-colors flex items-center gap-1"
            >
              ← Dashboard
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <h1 className="font-black text-gray-900 text-sm">{resume.full_name} — Resume</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/build-resume"
              className="border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              + New Resume
            </Link>
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200 flex items-center gap-2"
            >
              {downloading ? '⏳ Downloading...' : '📥 Download PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* ── RESUME PREVIEW ──────────────────── */}
      <div className="max-w-4xl mx-auto py-10 px-6">
        <div
          ref={resumeRef}
          className="bg-white shadow-2xl"
          style={{ minHeight: '297mm', width: '210mm', margin: '0 auto' }}
        >
          {resume.template === 'modern' && <ModernTemplate resume={resume} />}
          {resume.template === 'corporate' && <CorporateTemplate resume={resume} />}
          {resume.template === 'creative' && <CreativeTemplate resume={resume} />}
          {resume.template === 'minimal' && <MinimalTemplate resume={resume} />}
          {resume.template === 'tech' && <TechTemplate resume={resume} />}
          {resume.template === 'executive' && <ExecutiveTemplate resume={resume} />}
        </div>
      </div>

    </div>
  )
}

// ── MODERN TEMPLATE ────────────────────────
const ModernTemplate = ({ resume }) => (
  <div className="font-sans">
    {/* Header */}
    <div className="bg-rose-500 text-white px-10 py-8">
      <h1 className="text-4xl font-black tracking-tight mb-1">{resume.full_name}</h1>
      {resume.title && <p className="text-rose-100 text-lg font-medium mb-4">{resume.title}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-rose-100">
        {resume.email && <span>✉ {resume.email}</span>}
        {resume.phone && <span>📞 {resume.phone}</span>}
        {resume.location && <span>📍 {resume.location}</span>}
        {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
        {resume.website && <span>🌐 {resume.website}</span>}
      </div>
    </div>

    <div className="px-10 py-8">
      {/* Summary */}
      {resume.summary && (
        <div className="mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-3 pb-2 border-b-2 border-rose-500">
            Professional Summary
          </h2>
          <p className="text-gray-600 leading-relaxed text-sm">{resume.summary}</p>
        </div>
      )}

      {/* Experience */}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-500">
            Work Experience
          </h2>
          <div className="space-y-5">
            {resume.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{exp.position}</h3>
                    <p className="text-rose-500 font-semibold text-sm">{exp.company}</p>
                  </div>
                  {exp.duration && (
                    <span className="text-gray-400 text-sm bg-gray-50 px-3 py-1 rounded-full">{exp.duration}</span>
                  )}
                </div>
                {exp.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mt-1">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-500">
            Education
          </h2>
          <div className="space-y-4">
            {resume.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                </div>
                {edu.year && <span className="text-gray-400 text-sm">{edu.year}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-500">
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <span key={i} className="bg-rose-50 text-rose-600 font-semibold px-3 py-1.5 rounded-lg text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Languages */}
      {resume.languages && resume.languages.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b-2 border-rose-500">
            Languages
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.languages.map((lang, i) => (
              <span key={i} className="bg-gray-100 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-sm">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

// ── CORPORATE TEMPLATE ─────────────────────
const CorporateTemplate = ({ resume }) => (
  <div className="font-sans">
    <div className="bg-gray-900 text-white px-10 py-8">
      <h1 className="text-4xl font-black tracking-tight mb-1">{resume.full_name}</h1>
      {resume.title && <p className="text-gray-300 text-lg mb-4">{resume.title}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        {resume.email && <span>{resume.email}</span>}
        {resume.phone && <span>{resume.phone}</span>}
        {resume.location && <span>{resume.location}</span>}
      </div>
    </div>
    <div className="px-10 py-8">
      {resume.summary && (
        <div className="mb-8">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-widest mb-3 pb-2 border-b border-gray-300">Summary</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-300">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-900">{exp.position} — {exp.company}</h3>
                <span className="text-gray-400 text-sm">{exp.duration}</span>
              </div>
              {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-300">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                <p className="text-gray-600 text-sm">{edu.degree} {edu.field && `— ${edu.field}`}</p>
              </div>
              <span className="text-gray-400 text-sm">{edu.year}</span>
            </div>
          ))}
        </div>
      )}
      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h2 className="text-base font-black text-gray-900 uppercase tracking-widest mb-4 pb-2 border-b border-gray-300">Skills</h2>
          <p className="text-gray-600 text-sm">{resume.skills.join(' • ')}</p>
        </div>
      )}
    </div>
  </div>
)

// ── CREATIVE TEMPLATE ──────────────────────
const CreativeTemplate = ({ resume }) => (
  <div className="font-sans flex min-h-full">
    {/* Left sidebar */}
    <div className="w-72 bg-purple-600 text-white p-8 flex-shrink-0">
      <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black mb-4">
        {resume.full_name?.charAt(0)}
      </div>
      <h1 className="text-2xl font-black mb-1">{resume.full_name}</h1>
      {resume.title && <p className="text-purple-200 text-sm mb-6">{resume.title}</p>}
      <div className="space-y-2 mb-8">
        {resume.email && <p className="text-xs text-purple-100">✉ {resume.email}</p>}
        {resume.phone && <p className="text-xs text-purple-100">📞 {resume.phone}</p>}
        {resume.location && <p className="text-xs text-purple-100">📍 {resume.location}</p>}
      </div>
      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h3 className="font-black text-white uppercase tracking-wider text-xs mb-3">Skills</h3>
          <div className="flex flex-col gap-2">
            {resume.skills.map((skill, i) => (
              <span key={i} className="bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg">{skill}</span>
            ))}
          </div>
        </div>
      )}
    </div>
    {/* Right content */}
    <div className="flex-1 p-8">
      {resume.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-black text-purple-600 mb-3">About Me</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{resume.summary}</p>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-black text-purple-600 mb-4">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4 pl-4 border-l-2 border-purple-200">
              <h3 className="font-bold text-gray-900">{exp.position}</h3>
              <p className="text-purple-500 text-sm font-semibold">{exp.company} • {exp.duration}</p>
              {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.education && resume.education.length > 0 && (
        <div>
          <h2 className="text-lg font-black text-purple-600 mb-4">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-3 pl-4 border-l-2 border-purple-200">
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <p className="text-gray-500 text-sm">{edu.degree} {edu.field && `in ${edu.field}`} {edu.year && `• ${edu.year}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

// ── MINIMAL TEMPLATE ───────────────────────
const MinimalTemplate = ({ resume }) => (
  <div className="font-sans px-12 py-10">
    <div className="border-b-2 border-gray-900 pb-6 mb-8">
      <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">{resume.full_name}</h1>
      {resume.title && <p className="text-gray-500 text-lg">{resume.title}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-3">
        {resume.email && <span>{resume.email}</span>}
        {resume.phone && <span>{resume.phone}</span>}
        {resume.location && <span>{resume.location}</span>}
        {resume.linkedin && <span>{resume.linkedin}</span>}
      </div>
    </div>
    {resume.summary && (
      <div className="mb-8">
        <p className="text-gray-600 leading-relaxed">{resume.summary}</p>
      </div>
    )}
    {resume.experience && resume.experience.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Experience</h2>
        {resume.experience.map((exp, i) => (
          <div key={i} className="mb-5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-gray-900">{exp.position}</h3>
              <span className="text-gray-400 text-sm">{exp.duration}</span>
            </div>
            <p className="text-gray-500 text-sm">{exp.company}</p>
            {exp.description && <p className="text-gray-600 text-sm mt-1">{exp.description}</p>}
          </div>
        ))}
      </div>
    )}
    {resume.education && resume.education.length > 0 && (
      <div className="mb-8">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Education</h2>
        {resume.education.map((edu, i) => (
          <div key={i} className="flex justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <p className="text-gray-500 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</p>
            </div>
            <span className="text-gray-400 text-sm">{edu.year}</span>
          </div>
        ))}
      </div>
    )}
    {resume.skills && resume.skills.length > 0 && (
      <div>
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Skills</h2>
        <p className="text-gray-600 text-sm">{resume.skills.join(', ')}</p>
      </div>
    )}
  </div>
)

// ── TECH TEMPLATE ──────────────────────────
const TechTemplate = ({ resume }) => (
  <div className="font-mono">
    <div className="bg-gray-950 text-green-400 px-10 py-8">
      <p className="text-green-600 text-sm mb-1">{'// Developer Profile'}</p>
      <h1 className="text-4xl font-black text-white mb-1">{resume.full_name}</h1>
      {resume.title && <p className="text-green-400 mb-4">{resume.title}</p>}
      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        {resume.email && <span>email: "{resume.email}"</span>}
        {resume.phone && <span>phone: "{resume.phone}"</span>}
        {resume.location && <span>location: "{resume.location}"</span>}
      </div>
    </div>
    <div className="px-10 py-8 bg-gray-50">
      {resume.summary && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3">
            <span className="text-green-500">const</span> summary
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-200">{resume.summary}</p>
        </div>
      )}
      {resume.skills && resume.skills.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-3">
            <span className="text-green-500">const</span> skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <span key={i} className="bg-gray-900 text-green-400 font-mono text-xs px-3 py-1.5 rounded-lg">{skill}</span>
            ))}
          </div>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">
            <span className="text-green-500">const</span> experience
          </h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4 bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex justify-between">
                <h3 className="font-bold text-gray-900">{exp.position}</h3>
                <span className="text-gray-400 text-xs">{exp.duration}</span>
              </div>
              <p className="text-green-600 text-sm font-semibold">{exp.company}</p>
              {exp.description && <p className="text-gray-600 text-sm mt-2">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.education && resume.education.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-widest mb-4">
            <span className="text-green-500">const</span> education
          </h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-200 mb-3">
              <h3 className="font-bold text-gray-900">{edu.institution}</h3>
              <p className="text-gray-500 text-sm">{edu.degree} {edu.field && `in ${edu.field}`} {edu.year && `• ${edu.year}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

// ── EXECUTIVE TEMPLATE ─────────────────────
const ExecutiveTemplate = ({ resume }) => (
  <div className="font-sans">
    <div className="px-12 py-10 border-b-4 border-amber-500">
      <h1 className="text-5xl font-black text-gray-900 tracking-tight mb-2">{resume.full_name}</h1>
      {resume.title && <p className="text-amber-600 text-xl font-semibold mb-4">{resume.title}</p>}
      <div className="flex flex-wrap gap-6 text-sm text-gray-500">
        {resume.email && <span>✉ {resume.email}</span>}
        {resume.phone && <span>📞 {resume.phone}</span>}
        {resume.location && <span>📍 {resume.location}</span>}
        {resume.linkedin && <span>🔗 {resume.linkedin}</span>}
      </div>
    </div>
    <div className="px-12 py-8">
      {resume.summary && (
        <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-xl">
          <p className="text-gray-700 leading-relaxed italic">{resume.summary}</p>
        </div>
      )}
      {resume.experience && resume.experience.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-5">Professional Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-black text-gray-900 text-lg">{exp.position}</h3>
                  <p className="text-amber-600 font-semibold">{exp.company}</p>
                </div>
                <span className="text-gray-400 text-sm bg-gray-100 px-3 py-1 rounded-full">{exp.duration}</span>
              </div>
              {exp.description && <p className="text-gray-600 text-sm mt-2 leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </div>
      )}
      {resume.education && resume.education.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-5">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="flex justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{edu.institution}</h3>
                <p className="text-gray-500 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</p>
              </div>
              <span className="text-gray-400 text-sm">{edu.year}</span>
            </div>
          ))}
        </div>
      )}
      {resume.skills && resume.skills.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-4">Core Competencies</h2>
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill, i) => (
              <span key={i} className="border border-amber-300 text-amber-700 font-semibold px-3 py-1.5 rounded-lg text-sm bg-amber-50">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)

export default ViewResume