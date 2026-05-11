// ============================================
// COVER LETTER PAGE
// AI powered cover letter generator
// ============================================

import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { groqAI } from '../lib/groq'

const CoverLetter = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const [form, setForm] = useState({
    job_title: '',
    company_name: '',
    job_description: '',
    your_name: '',
    your_skills: '',
    your_experience: '',
    tone: 'professional',
    content: ''
  })

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Generate cover letter with AI
  const generateCoverLetter = async () => {
    try {
      setGenerating(true)
      const prompt = `Write a professional cover letter for:

Job Title: ${form.job_title}
Company: ${form.company_name}
Job Description: ${form.job_description}

Applicant Details:
Name: ${form.your_name}
Skills: ${form.your_skills}
Experience: ${form.your_experience}
Tone: ${form.tone}

Write a compelling, personalized cover letter that:
- Has a strong opening that grabs attention
- Highlights relevant skills and experience
- Shows enthusiasm for the specific company and role
- Ends with a clear call to action
- Is 3-4 paragraphs long
- Sounds human and authentic, not robotic

Do NOT include placeholders like [Your Name] or [Date]. Write it complete and ready to send.`

      const content = await groqAI(prompt, 'You are an expert career coach and cover letter writer with 10 years of experience helping people land their dream jobs.')
      updateField('content', content)
      setGenerated(true)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // Save to Supabase
  const saveCoverLetter = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('cover_letters')
        .insert([{
          user_id: user.id,
          title: `${form.job_title} at ${form.company_name}`,
          job_title: form.job_title,
          company_name: form.company_name,
          content: form.content,
        }])
        .select()
        .single()

      if (error) throw error
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── HEADER ────────────────────────── */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors font-semibold text-sm"
            >
              ← Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <h1 className="font-black text-gray-900">Cover Letter Generator</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-black text-gray-900">Snap<span className="text-rose-500">CV</span></span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 gap-8">

          {/* ── LEFT — Form ───────────────── */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Generate Cover Letter</h2>
              <p className="text-gray-400 text-sm">Fill in the details and let AI write it for you</p>
            </div>

            {/* Job Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-rose-500">Job Details</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Job Title *</label>
                <input
                  type="text"
                  placeholder="Senior React Developer"
                  value={form.job_title}
                  onChange={e => updateField('job_title', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company Name *</label>
                <input
                  type="text"
                  placeholder="Google"
                  value={form.company_name}
                  onChange={e => updateField('company_name', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Job Description</label>
                <textarea
                  placeholder="Paste the job description here..."
                  rows={4}
                  value={form.job_description}
                  onChange={e => updateField('job_description', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Your Details */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
              <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider text-rose-500">Your Details</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Name *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.your_name}
                  onChange={e => updateField('your_name', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Skills</label>
                <input
                  type="text"
                  placeholder="React, Node.js, Python..."
                  value={form.your_skills}
                  onChange={e => updateField('your_skills', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Experience</label>
                <textarea
                  placeholder="3 years as React developer at XYZ company..."
                  rows={3}
                  value={form.your_experience}
                  onChange={e => updateField('your_experience', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tone</label>
                <select
                  value={form.tone}
                  onChange={e => updateField('tone', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="confident">Confident & Bold</option>
                  <option value="creative">Creative</option>
                  <option value="formal">Formal</option>
                </select>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCoverLetter}
              disabled={generating || !form.job_title || !form.company_name || !form.your_name}
              className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200 flex items-center justify-center gap-2"
            >
              {generating ? (
                <>⏳ Generating your cover letter...</>
              ) : (
                <>✨ Generate with AI</>
              )}
            </button>
          </div>

          {/* ── RIGHT — Preview ───────────── */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">Preview</h2>
              {generated && (
                <button
                  onClick={saveCoverLetter}
                  disabled={loading}
                  className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                >
                  {loading ? '⏳ Saving...' : '💾 Save'}
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-8 min-h-96 flex-1">
              {!generated && !generating ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <span className="text-5xl mb-4">💌</span>
                  <h3 className="font-bold text-gray-900 mb-2">Your cover letter will appear here</h3>
                  <p className="text-gray-400 text-sm">Fill in the form and click Generate</p>
                </div>
              ) : generating ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-16">
                  <div className="text-5xl mb-4 animate-bounce">✨</div>
                  <h3 className="font-bold text-gray-900 mb-2">AI is writing your cover letter...</h3>
                  <p className="text-gray-400 text-sm">This takes 5-10 seconds</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-black text-gray-900">{form.your_name}</h3>
                    <p className="text-gray-400 text-sm">{form.job_title} Application — {form.company_name}</p>
                  </div>

                  {/* Content - editable */}
                  <textarea
                    value={form.content}
                    onChange={e => updateField('content', e.target.value)}
                    className="w-full text-gray-700 text-sm leading-relaxed outline-none resize-none border-none bg-transparent"
                    rows={20}
                  />

                  {/* Actions */}
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={generateCoverLetter}
                      disabled={generating}
                      className="flex-1 border-2 border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-all"
                    >
                      🔄 Regenerate
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(form.content)}
                      className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-semibold py-2.5 rounded-xl text-sm transition-all"
                    >
                      📋 Copy
                    </button>
                    <button
                      onClick={saveCoverLetter}
                      disabled={loading}
                      className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-bold py-2.5 rounded-xl text-sm transition-all"
                    >
                      💾 Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CoverLetter