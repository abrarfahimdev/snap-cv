import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">S</div>
              <span className="text-xl font-black">Snap<span className="text-rose-500">CV</span></span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Create professional AI-powered resumes in 60 seconds. Land your dream job faster.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Product</h4>
            <div className="flex flex-col gap-3">
              <Link to="/#features" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Features</Link>
              <Link to="/#pricing" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Pricing</Link>
              <Link to="/#how" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">How It Works</Link>
              <Link to="/register" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Get Started</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-4">Company</h4>
            <div className="flex flex-col gap-3">
              <Link to="/" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">About</Link>
              <Link to="/" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Blog</Link>
              <Link to="/" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/" className="text-gray-400 hover:text-rose-400 text-sm transition-colors">Terms of Service</Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© 2026 SnapCV. All rights reserved.</p>
          <p className="text-gray-500 text-sm">Built with ❤️ by Fahim Abrar</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer