// ============================================
// BUILD RESUME PAGE
// Multi-step AI powered resume builder
// ============================================

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { groqAI } from '../lib/groq'

// ── STEP INDICATOR ─────────────────────────
const StepIndicator = ({ currentStep, steps }) => (
  <div className="flex items-center justify-center gap-0 mb-12">
    {steps.map((step, i) => (
      <div key={i} className="flex items-center">
        <div className="flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
            currentStep > i + 1
              ? 'bg-rose-500 text-white'
              : currentStep === i + 1
              ? 'bg-rose-500 text-white ring-4 ring-rose-100'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {currentStep > i + 1 ? '✓' : i + 1}
          </div>
          <p className={`text-xs font-semibold mt-2 whitespace-nowrap ${
            currentStep === i + 1 ? 'text-rose-500' : 'text-gray-400'
          }`}>
            {step}
          </p>
        </div>
        {i < steps.length - 1 && (
          <div className={`w-24 h-0.5 mb-5 mx-2 ${
            currentStep > i + 1 ? 'bg-rose-500' : 'bg-gray-200'
          }`} />
        )}
      </div>
    ))}
  </div>
)

// ── MAIN COMPONENT ─────────────────────────
const BuildResume = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  // Form data
  const [form, setForm] = useState({
    // Step 1 — Personal Info
    full_name: '',
    email: user?.email || '',
    phone: '',
    location: '',
    website: '',
    linkedin: '',
    title: '',

    // Step 2 — Experience
    experience: [
      { company: '', position: '', duration: '', description: '' }
    ],

    // Step 3 — Education
    education: [
      { institution: '', degree: '', field: '', year: '' }
    ],

    // Step 4 — Skills
    skills: '',
    languages: '',
    summary: '',

    // Template
    template: 'modern',
  })

  const steps = ['Personal Info', 'Experience', 'Education', 'Skills & Summary', 'Template']

  // Update simple field
  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // Update experience
  const updateExperience = (index, field, value) => {
    const updated = [...form.experience]
    updated[index][field] = value
    setForm(prev => ({ ...prev, experience: updated }))
  }

  // Add experience
  const addExperience = () => {
    setForm(prev => ({
      ...prev,
      experience: [...prev.experience, { company: '', position: '', duration: '', description: '' }]
    }))
  }

  // Remove experience
  const removeExperience = (index) => {
    setForm(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }

  // Update education
  const updateEducation = (index, field, value) => {
    const updated = [...form.education]
    updated[index][field] = value
    setForm(prev => ({ ...prev, education: updated }))
  }

  // Add education
  const addEducation = () => {
    setForm(prev => ({
      ...prev,
      education: [...prev.education, { institution: '', degree: '', field: '', year: '' }]
    }))
  }

  // Remove education
  const removeEducation = (index) => {
    setForm(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  // Generate AI summary
  const generateSummary = async () => {
    try {
      setGenerating(true)
      const prompt = `Write a professional resume summary for:
Name: ${form.full_name}
Title: ${form.title}
Experience: ${form.experience.map(e => `${e.position} at ${e.company}`).join(', ')}
Skills: ${form.skills}

Write a compelling 3-4 sentence professional summary. Be specific and impactful. No fluff.`

      const summary = await groqAI(prompt)
      updateField('summary', summary)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  // Save resume to Supabase
  const saveResume = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('resumes')
        .insert([{
          user_id: user.id,
          title: form.title || form.full_name,
          full_name: form.full_name,
          email: form.email,
          phone: form.phone,
          location: form.location,
          website: form.website,
          linkedin: form.linkedin,
          summary: form.summary,
          experience: form.experience,
          education: form.education,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
          languages: form.languages.split(',').map(l => l.trim()).filter(Boolean),
          template: form.template,
          ai_generated: true,
        }])
        .select()
        .single()

      if (error) throw error
      navigate(`/resume/${data.id}`)
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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Back
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <h1 className="font-black text-gray-900">Build Resume</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">S</div>
            <span className="font-black text-gray-900">Snap<span className="text-rose-500">CV</span></span>
          </div>
        </div>
      </div>

      {/* ── CONTENT ───────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Step Indicator */}
        <StepIndicator currentStep={step} steps={steps} />

        {/* ── STEP 1 — Personal Info ────────── */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Personal Information</h2>
            <p className="text-gray-400 text-sm mb-8">Tell us about yourself</p>

            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title / Professional Title</label>
                <input
                  type="text"
                  placeholder="e.g. Senior React Developer"
                  value={form.title}
                  onChange={e => updateField('title', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Smith"
                  value={form.full_name}
                  onChange={e => updateField('full_name', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="john@email.com"
                  value={form.email}
                  onChange={e => updateField('email', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <input
                  type="text"
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  placeholder="New York, USA"
                  value={form.location}
                  onChange={e => updateField('location', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">LinkedIn URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/yourname"
                  value={form.linkedin}
                  onChange={e => updateField('linkedin', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Website / Portfolio</label>
                <input
                  type="text"
                  placeholder="yourwebsite.com"
                  value={form.website}
                  onChange={e => updateField('website', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => setStep(2)}
                disabled={!form.full_name || !form.email}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                Next: Experience →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 — Experience ───────────── */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Work Experience</h2>
            <p className="text-gray-400 text-sm mb-8">Add your work history (most recent first)</p>

            <div className="flex flex-col gap-6">
              {form.experience.map((exp, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl p-6 relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Experience {i + 1}</h3>
                    {form.experience.length > 1 && (
                      <button
                        onClick={() => removeExperience(i)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Company *</label>
                      <input
                        type="text"
                        placeholder="Google"
                        value={exp.company}
                        onChange={e => updateExperience(i, 'company', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Position *</label>
                      <input
                        type="text"
                        placeholder="Software Engineer"
                        value={exp.position}
                        onChange={e => updateExperience(i, 'position', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Duration</label>
                      <input
                        type="text"
                        placeholder="Jan 2022 - Present"
                        value={exp.duration}
                        onChange={e => updateExperience(i, 'duration', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Description</label>
                      <textarea
                        placeholder="Describe your responsibilities and achievements..."
                        rows={3}
                        value={exp.description}
                        onChange={e => updateExperience(i, 'description', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addExperience}
              className="mt-4 border-2 border-dashed border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-400 font-semibold w-full py-3 rounded-xl text-sm transition-all"
            >
              + Add Another Experience
            </button>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                Next: Education →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3 — Education ────────────── */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Education</h2>
            <p className="text-gray-400 text-sm mb-8">Add your educational background</p>

            <div className="flex flex-col gap-6">
              {form.education.map((edu, i) => (
                <div key={i} className="border-2 border-gray-100 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Education {i + 1}</h3>
                    {form.education.length > 1 && (
                      <button
                        onClick={() => removeEducation(i)}
                        className="text-red-400 hover:text-red-600 text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Institution *</label>
                      <input
                        type="text"
                        placeholder="Harvard University"
                        value={edu.institution}
                        onChange={e => updateEducation(i, 'institution', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Degree</label>
                      <input
                        type="text"
                        placeholder="Bachelor of Science"
                        value={edu.degree}
                        onChange={e => updateEducation(i, 'degree', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Field of Study</label>
                      <input
                        type="text"
                        placeholder="Computer Science"
                        value={edu.field}
                        onChange={e => updateEducation(i, 'field', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5">Graduation Year</label>
                      <input
                        type="text"
                        placeholder="2022"
                        value={edu.year}
                        onChange={e => updateEducation(i, 'year', e.target.value)}
                        className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 rounded-xl px-4 py-2.5 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addEducation}
              className="mt-4 border-2 border-dashed border-gray-200 hover:border-rose-300 hover:text-rose-500 text-gray-400 font-semibold w-full py-3 rounded-xl text-sm transition-all"
            >
              + Add Another Education
            </button>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                Next: Skills →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 — Skills & Summary ─────── */}
        {step === 4 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Skills & Summary</h2>
            <p className="text-gray-400 text-sm mb-8">Add your skills and let AI write your summary</p>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Skills (comma separated) *</label>
                <textarea
                  placeholder="React, Node.js, Python, SQL, Git, Docker..."
                  rows={3}
                  value={form.skills}
                  onChange={e => updateField('skills', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Languages (comma separated)</label>
                <input
                  type="text"
                  placeholder="English, Bengali, Hindi..."
                  value={form.languages}
                  onChange={e => updateField('languages', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all text-gray-900 placeholder-gray-400"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Professional Summary</label>
                  <button
                    onClick={generateSummary}
                    disabled={generating || !form.skills}
                    className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 disabled:opacity-50 text-rose-500 font-semibold px-4 py-2 rounded-xl text-xs transition-all"
                  >
                    {generating ? '⏳ Generating...' : '✨ Generate with AI'}
                  </button>
                </div>
                <textarea
                  placeholder="Write a professional summary or click Generate with AI..."
                  rows={5}
                  value={form.summary}
                  onChange={e => updateField('summary', e.target.value)}
                  className="w-full bg-gray-50 border-2 border-gray-200 focus:border-rose-500 focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none text-gray-900 placeholder-gray-400"
                />
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(3)}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep(5)}
                disabled={!form.skills}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                Next: Template →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5 — Template ─────────────── */}
        {step === 5 && (
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-gray-900 mb-2">Choose Template</h2>
            <p className="text-gray-400 text-sm mb-8">Pick a design for your resume</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { id: 'modern', name: 'Modern', desc: 'Clean and minimal', emoji: '🎯', color: 'from-rose-400 to-rose-600' },
                { id: 'corporate', name: 'Corporate', desc: 'Traditional professional', emoji: '🏢', color: 'from-blue-400 to-blue-600' },
                { id: 'creative', name: 'Creative', desc: 'Bold and unique', emoji: '🎨', color: 'from-purple-400 to-purple-600' },
                { id: 'minimal', name: 'Minimal', desc: 'Simple and elegant', emoji: '✨', color: 'from-gray-400 to-gray-600' },
                { id: 'tech', name: 'Tech', desc: 'For developers', emoji: '💻', color: 'from-green-400 to-green-600' },
                { id: 'executive', name: 'Executive', desc: 'For senior roles', emoji: '👔', color: 'from-amber-400 to-amber-600' },
              ].map(template => (
                <button
                  key={template.id}
                  onClick={() => updateField('template', template.id)}
                  className={`border-2 rounded-2xl p-5 text-left transition-all ${
                    form.template === template.id
                      ? 'border-rose-500 bg-rose-50'
                      : 'border-gray-200 hover:border-rose-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.color} flex items-center justify-center text-2xl mb-3`}>
                    {template.emoji}
                  </div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{template.name}</h3>
                  <p className="text-xs text-gray-400">{template.desc}</p>
                  {form.template === template.id && (
                    <div className="mt-2 text-xs font-bold text-rose-500">✓ Selected</div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(4)}
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-600 font-bold px-8 py-3.5 rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
              <button
                onClick={saveResume}
                disabled={loading}
                className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:shadow-lg hover:shadow-rose-200"
              >
                {loading ? '⏳ Creating Resume...' : '🚀 Create Resume →'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default BuildResume