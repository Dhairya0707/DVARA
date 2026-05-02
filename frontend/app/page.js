import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-slate-200 selection:text-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-200/50 bg-white/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                D
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">DVARA</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link href="#documentation" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Documentation</Link>
              <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
            </div>

            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">
                Log in
              </Link>
              <Link href="/register" className="btn-sarvam-secondary !px-5 !py-2">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-slate-700 text-sm font-medium mb-8 border border-slate-200/50 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-500"></span>
              </span>
              DVARA 1.0 is now live
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 max-w-4xl mx-auto leading-tight">
              Transparent API Rate Limiting <span className="font-serif italic font-medium text-slate-600">Simplified.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
              A privacy-first, utility-driven API rate limiter. Protect your infrastructure with intelligent request control, insightful analytics, and seamless integration.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/register" className="btn-sarvam w-full sm:w-auto">
                Start for Free
              </Link>
              <Link href="#documentation" className="btn-sarvam-secondary w-full sm:w-auto">
                Read the Docs
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-24 bg-white/40 backdrop-blur-sm border-t border-slate-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl font-serif">Everything you need to control traffic</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">Powerful features designed to keep your APIs stable, secure, and fast.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 mb-6 border border-slate-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                <p className="text-slate-600 leading-relaxed">Edge-optimized rate limiting with sub-millisecond latency. Never slow down your users.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 mb-6 border border-slate-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Privacy First</h3>
                <p className="text-slate-600 leading-relaxed">We never store your payload data. Completely transparent, secure, and compliant by design.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-white">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-800 mb-6 border border-slate-100">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Easy Integration</h3>
                <p className="text-slate-600 leading-relaxed">Drop-in SDKs for Node.js, Python, and Go. Get up and running in less than 5 minutes.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white/40 backdrop-blur-sm border-t border-slate-200/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">
              D
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900">DVARA</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} DVARA Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
