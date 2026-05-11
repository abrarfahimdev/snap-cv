import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="bg-white">

      {/* ── HERO ──────────────────────────────── */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl opacity-60" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="max-w-3xl">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-500 text-sm font-semibold px-4 py-2 rounded-full mb-8">
              🚀 AI-Powered Resume Builder
            </div>

            {/* Heading */}
            <h1 className="text-6xl md:text-7xl font-black text-gray-900 leading-tight tracking-tight mb-6">
              Build a{' '}
              <span className="text-rose-500">Job-Winning</span>
              {' '}Resume in{' '}
              <span className="text-rose-500">60 Seconds</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
              Let AI write your perfect resume. Just fill in your details and get a professional, ATS-optimized resume instantly.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                to="/register"
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-1"
              >
                Build My Resume Free →
              </Link>
              <Link
                to="/#how"
                className="border-2 border-gray-200 hover:border-rose-300 text-gray-700 hover:text-rose-500 font-bold px-8 py-4 rounded-2xl text-base transition-all"
              >
                See How It Works
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-10">
              {[
                { value: '50K+', label: 'Resumes Created' },
                { value: '94%', label: 'Interview Rate' },
                { value: '60s', label: 'Average Build Time' },
                { value: 'Free', label: 'To Get Started' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl font-black text-rose-500">{stat.value}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────── */}
      <section id="how" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-500 text-sm font-bold uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: '📝', title: 'Fill Your Details', desc: 'Enter your experience, education and skills in our simple form.' },
              { step: '02', icon: '🤖', title: 'AI Writes It', desc: 'Our AI generates professional content tailored to your profile.' },
              { step: '03', icon: '🎨', title: 'Pick a Template', desc: 'Choose from beautiful ATS-friendly resume templates.' },
              { step: '04', icon: '📥', title: 'Download PDF', desc: 'Download your polished resume and start applying immediately.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-14 h-14 bg-rose-500 text-white rounded-2xl flex items-center justify-center font-black text-lg mx-auto mb-4">
                  {step.step}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────── */}
      <section id="features" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-500 text-sm font-bold uppercase tracking-widest">Why SnapCV</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
              Everything You Need to Land the Job
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Resume Writer', desc: 'Our AI analyzes thousands of successful resumes to write yours in seconds. No more staring at a blank page.' },
              { icon: '🎯', title: 'ATS Optimized', desc: 'Beat applicant tracking systems with the right keywords. Our resumes are designed to get past filters.' },
              { icon: '💌', title: 'Cover Letter AI', desc: 'Generate a tailored cover letter for every job application in one click. Stand out from the crowd.' },
              { icon: '📊', title: 'Resume Score', desc: 'Paste any job description and get a match score with suggestions to improve your resume instantly.' },
              { icon: '🎨', title: 'Beautiful Templates', desc: 'Choose from 6 professionally designed templates. Modern, creative, corporate and more.' },
              { icon: '📥', title: 'Instant PDF', desc: 'Download your resume as a pixel-perfect PDF instantly. Ready to send to employers right away.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-gray-50 hover:bg-white border border-gray-100 hover:border-rose-200 rounded-2xl p-8 transition-all hover:shadow-xl hover:shadow-rose-50 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────── */}
      <section id="pricing" className="py-24 bg-gray-50 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-500 text-sm font-bold uppercase tracking-widest">Pricing</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-500 mt-4">Start free. Upgrade when you need more.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '$0',
                period: 'forever',
                desc: 'Perfect to get started',
                features: ['1 Resume', '1 Cover Letter', '2 Templates', 'PDF Download', 'Watermark'],
                cta: 'Get Started Free',
                popular: false,
              },
              {
                name: 'Pro',
                price: '$9',
                period: '/month',
                desc: 'For active job seekers',
                features: ['Unlimited Resumes', 'Unlimited Cover Letters', 'All 6 Templates', 'No Watermark', 'Resume Score', 'Priority Support'],
                cta: 'Start Pro →',
                popular: true,
              },
              {
                name: 'Lifetime',
                price: '$49',
                period: 'one time',
                desc: 'Pay once, use forever',
                features: ['Everything in Pro', 'Lifetime Access', 'Future Templates', 'LinkedIn Optimizer', 'Interview Prep', 'VIP Support'],
                cta: 'Get Lifetime →',
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`relative bg-white rounded-3xl p-8 border-2 transition-all ${
                  plan.popular
                    ? 'border-rose-500 shadow-2xl shadow-rose-100 scale-105'
                    : 'border-gray-200 hover:border-rose-300'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                    ⭐ Most Popular
                  </div>
                )}
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.period}</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">{plan.desc}</p>
                <div className="flex flex-col gap-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="text-rose-500 font-bold">✓</span>
                      {feature}
                    </div>
                  ))}
                </div>
                <Link
                  to="/register"
                  className={`block text-center font-bold py-3.5 rounded-xl text-sm transition-all ${
                    plan.popular
                      ? 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-lg hover:shadow-rose-200'
                      : 'border-2 border-gray-200 hover:border-rose-400 text-gray-700 hover:text-rose-500'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────── */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-rose-500 text-sm font-bold uppercase tracking-widest">Reviews</span>
            <h2 className="text-4xl font-black text-gray-900 mt-3 tracking-tight">
              People Love SnapCV
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'Software Engineer', avatar: '👩‍💻', text: 'I got 3 interview calls within a week of using SnapCV. The AI wrote better than I ever could!', rating: 5 },
              { name: 'Ahmed Hassan', role: 'Marketing Manager', avatar: '👨‍💼', text: 'Created my resume in literally 2 minutes. Landed my dream job at a Fortune 500 company!', rating: 5 },
              { name: 'Priya Patel', role: 'UX Designer', avatar: '👩‍🎨', text: 'The templates are gorgeous and ATS-friendly. Finally a tool that actually works!', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-gray-50 border border-gray-100 hover:border-rose-200 rounded-2xl p-8 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-rose-50">
                <div className="text-yellow-400 text-lg mb-4">{'⭐'.repeat(t.rating)}</div>
                <p className="text-gray-700 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-rose-100 rounded-full flex items-center justify-center text-xl">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-gray-400 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-rose-500 to-rose-600 rounded-3xl px-12 py-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
                Ready to Land Your Dream Job?
              </h2>
              <p className="text-rose-100 text-lg mb-10 max-w-xl mx-auto">
                Join 50,000+ professionals who built their perfect resume with SnapCV.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-rose-500 hover:bg-rose-50 font-bold px-8 py-4 rounded-2xl text-base transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  Build My Resume Free →
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-white/40 hover:border-white text-white font-bold px-8 py-4 rounded-2xl text-base transition-all"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home