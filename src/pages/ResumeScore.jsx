// ============================================
// RESUME SCORE PAGE
// AI powered resume analyzer with PDF upload
// ============================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { groqAI } from '../lib/groq'

const ResumeScore = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const [pdfName, setPdfName] = useState('')
  const [form, setForm] = useState({
    resume_text: '',
    job_description: ''
  })

  // ── Handle PDF Upload ──────────────────────
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    await readPDF(file)
  }

  // ── Handle Drag and Drop ───────────────────
  const handleDrop = async (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file || file.type !== 'application/pdf') return
    await readPDF(file)
  }

  // ── Read PDF Text ──────────────────────────
  const readPDF = async (file) => {
    try {
      setPdfLoading(true)
      setPdfName(file.name)

      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

      const arrayBuffer = await file.arrayBuffer()
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      let text = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map(item => item.str).join(' ')
        text += pageText + '\n'
      }

      setForm(prev => ({ ...prev, resume_text: text.trim() }))
    } catch (err) {
      console.error('PDF reading error:', err)
      alert('Could not read PDF. Please paste text manually.')
    } finally {
      setPdfLoading(false)
    }
  }

  // ── Analyze Resume with AI ─────────────────
  const analyzeResume = async () => {
    try {
      setLoading(true)
      setResult(null)

      const prompt = `Analyze this resume against the job description and provide a detailed score.

RESUME:
${form.resume_text}

JOB DESCRIPTION:
${form.job_description}

Provide analysis in this EXACT JSON format (no extra text, no markdown):
{
  "overall_score": 85,
  "match_percentage": 78,
  "sections": {
    "skills_match": 90,
    "experience_match": 80,
    "education_match": 75,
    "keywords_match": 70
  },
  "matched_keywords": ["React", "Node.js", "API"],
  "missing_keywords": ["Docker", "AWS", "TypeScript"],
  "strengths": [
    "Strong technical skills in React",
    "Relevant work experience",
    "Good educational background"
  ],
  "improvements": [
    "Add Docker experience",
    "Include AWS certifications",
    "Quantify achievements with numbers"
  ],
  "summary": "Your resume is a strong match for this position. Focus on adding missing keywords."
}`

      const response = await groqAI(prompt, 'You are an expert ATS system and career coach. Always respond with valid JSON only. No markdown, no extra text.')
      const cleaned = response.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(cleaned)
      setResult(parsed)

    } catch (err) {
      console.error(err)
      alert('Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Score Helpers ──────────────────────────
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreBar = (score) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return '🔥 Excellent'
    if (score >= 60) return '👍 Good'
    if (score >= 40) return '⚠️ Fair'
    return '❌ Needs Work'
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ──────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors font-semibold text-sm"
            >
              ← Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <h1 className="font-black text-gray-900">Resume Score & Job Analyzer</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-black text-gray-900">Snap<span className="text-rose-500">CV</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ── PAGE HEADER ─────────────────────── */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-500 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🎯 AI Powered ATS Scanner
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            How Well Does Your Resume Match?
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm">
            Upload your resume PDF or paste text. Add the job description and get an instant AI score with improvement tips.
          </p>
        </div>

        {/* ── INPUT SECTION ───────────────────── */}
        {!result && !loading && (
          <>
            <div className="grid grid-cols-2 gap-6 mb-6">

              {/* Left — Resume Input */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                <label className="block text-sm font-bold text-gray-900">
                  📄 Your Resume
                </label>

                {/* PDF Upload */}
                <div
                  className="border-2 border-dashed border-gray-200 hover:border-rose-400 rounded-xl p-6 text-center cursor-pointer transition-all group"
                  onClick={() => document.getElementById('pdf-upload').click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                >
                  <div className="text-3xl mb-2">📤</div>
                  <p className="text-sm font-semibold text-gray-600 group-hover:text-rose-500 transition-colors">
                    Upload PDF Resume
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Click or drag & drop your PDF here</p>
                  {pdfLoading && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-rose-500 text-sm font-semibold">
                      <span className="animate-spin">⏳</span> Reading PDF...
                    </div>
                  )}
                  {pdfName && !pdfLoading && (
                    <div className="mt-3 bg-rose-50 text-rose-500 text-xs font-semibold px-3 py-1.5 rounded-lg inline-block">
                      ✅ {pdfName}
                    </div>
                  )}
                </div>
                <input
                  id="pdf-upload"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handlePDFUpload}
                />

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-semibold">OR TYPE MANUALLY</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Text Input */}
                <textarea
                  placeholder="Paste your resume text here...

John Smith | React Developer
john@email.com | +1234567890

EXPERIENCE
Senior Developer at Google (2021-Present)
- Built scalable React applications
- Led team of 5 developers

SKILLS
React, Node.js, Python, SQL..."
                  rows={10}
                  value={form.resume_text}
                  onChange={e => setForm({ ...form, resume_text: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              {/* Right — Job Description */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">
                  💼 Job Description
                </label>
                <textarea
                  placeholder="Paste the job description here...

Senior React Developer
Company: TechCorp

We are looking for an experienced React developer to join our team.

Requirements:
- 3+ years React experience
- Node.js knowledge
- Experience with REST APIs
- Strong CSS skills
- Docker experience preferred
- AWS knowledge a plus

Responsibilities:
- Build and maintain React applications
- Collaborate with backend team
- Write clean, tested code..."
                  rows={22}
                  value={form.job_description}
                  onChange={e => setForm({ ...form, job_description: e.target.value })}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={analyzeResume}
                disabled={!form.resume_text || !form.job_description}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-12 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-1 inline-flex items-center gap-3"
              >
                🎯 Analyze My Resume
              </button>
              <p className="text-gray-400 text-xs mt-3">Takes 5-10 seconds • Powered by AI</p>
            </div>
          </>
        )}

        {/* ── LOADING STATE ───────────────────── */}
        {loading && (
          <div className="bg-white rounded-3xl border border-gray-100 p-20 text-center">
            <div className="text-6xl mb-6 animate-bounce">🤖</div>
            <h3 className="text-2xl font-black text-gray-900 mb-3">Analyzing your resume...</h3>
            <p className="text-gray-400 mb-8">Checking keywords, skills match and ATS compatibility</p>
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── RESULTS ─────────────────────────── */}
        {result && !loading && (
          <div className="flex flex-col gap-6">

            {/* Top Scores */}
            <div className="grid grid-cols-3 gap-6">

              {/* Overall Score */}
              <div className={`bg-white rounded-3xl border-2 p-8 text-center ${getScoreBg(result.overall_score)}`}>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Overall Score</p>
                <div className={`text-7xl font-black mb-2 ${getScoreColor(result.overall_score)}`}>
                  {result.overall_score}
                </div>
                <p className="text-gray-400 text-xs mb-4">out of 100</p>
                <span className={`text-sm font-bold px-4 py-2 rounded-full ${
                  result.overall_score >= 80 ? 'bg-green-100 text-green-600' :
                  result.overall_score >= 60 ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  {getScoreLabel(result.overall_score)}
                </span>
              </div>

              {/* Match % */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8 text-center">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Job Match</p>
                <div className={`text-7xl font-black mb-2 ${getScoreColor(result.match_percentage)}`}>
                  {result.match_percentage}%
                </div>
                <p className="text-gray-400 text-xs mb-4">compatibility</p>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${getScoreBar(result.match_percentage)}`}
                    style={{ width: `${result.match_percentage}%` }}
                  />
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">AI Summary</p>
                <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
                <button
                  onClick={() => { setResult(null); setPdfName('') }}
                  className="mt-4 text-rose-500 text-xs font-bold hover:underline"
                >
                  ← Analyze Another
                </button>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8">
              <h3 className="font-black text-gray-900 text-lg mb-6">📊 Section Breakdown</h3>
              <div className="grid grid-cols-2 gap-6">
                {Object.entries(result.sections).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-gray-700 capitalize">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className={`text-sm font-black ${getScoreColor(score)}`}>{score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getScoreBar(score)}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-2 gap-6">

              {/* Matched */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h3 className="font-black text-gray-900 mb-2">
                  ✅ Matched Keywords
                </h3>
                <p className="text-green-500 text-sm font-semibold mb-4">
                  {result.matched_keywords?.length || 0} keywords found in your resume
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matched_keywords?.map((keyword, i) => (
                    <span key={i} className="bg-green-50 text-green-600 border border-green-200 font-semibold px-3 py-1.5 rounded-lg text-sm">
                      ✓ {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h3 className="font-black text-gray-900 mb-2">
                  ❌ Missing Keywords
                </h3>
                <p className="text-red-400 text-sm font-semibold mb-4">
                  Add these to improve your score
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missing_keywords?.map((keyword, i) => (
                    <span key={i} className="bg-red-50 text-red-500 border border-red-200 font-semibold px-3 py-1.5 rounded-lg text-sm">
                      + {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid grid-cols-2 gap-6">

              {/* Strengths */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h3 className="font-black text-gray-900 text-lg mb-5">💪 Your Strengths</h3>
                <div className="flex flex-col gap-4">
                  {result.strengths?.map((strength, i) => (
                    <div key={i} className="flex items-start gap-3 bg-green-50 p-3 rounded-xl">
                      <span className="text-green-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Improvements */}
              <div className="bg-white rounded-3xl border border-gray-100 p-8">
                <h3 className="font-black text-gray-900 text-lg mb-5">🚀 How To Improve</h3>
                <div className="flex flex-col gap-4">
                  {result.improvements?.map((improvement, i) => (
                    <div key={i} className="flex items-start gap-3 bg-rose-50 p-3 rounded-xl">
                      <span className="text-rose-500 font-bold flex-shrink-0 mt-0.5">→</span>
                      <p className="text-gray-700 text-sm leading-relaxed">{improvement}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pb-8">
              <button
                onClick={() => { setResult(null); setPdfName('') }}
                className="border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-bold px-8 py-3.5 rounded-2xl text-sm transition-all"
              >
                ← Analyze Another Resume
              </button>
              <Link
                to="/build-resume"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                ✨ Build Better Resume →
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default ResumeScore