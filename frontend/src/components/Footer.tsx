import React, { useState, useEffect } from 'react'
import { Github, Linkedin, Mail, Phone, ArrowUp, Send, CheckCircle2, Brain } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'Projects', href: '#portfolio' },
    { label: 'Blog', href: '#blog' }
  ]

  const resources = [
    { label: 'About Me', href: '#achievements' },
    { label: 'Resume', href: '#contact' },
    { label: 'Certifications', href: '#achievements' },
    { label: 'Tech Stack', href: '#technology' }
  ]

  return (
    <footer className="bg-slate-950 text-slate-450 border-t border-slate-900/60 py-16 px-4 relative select-none">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand/About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">IntelliCore</h3>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Developing state-of-the-art Generative AI applications, RAG pipelines, and multi-agent system workflows.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h3>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white font-sans">Newsletter</h3>
            <p className="text-xs leading-relaxed text-slate-400">
              Subscribe to get my latest publications, tutorials, and project updates.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="px-3.5 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl outline-none text-slate-200 placeholder-slate-500 focus:border-cyan-500 flex-1 transition-colors"
                required
              />
              <button
                type="submit"
                className="p-2.5 bg-white text-slate-950 hover:bg-slate-100 rounded-xl flex items-center justify-center transition-colors active:scale-95 shadow-lg"
              >
                {subscribed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 my-8" />

        {/* Bottom copyright & socials */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-xs text-slate-500 font-semibold font-sans">
            &copy; {year} Abhishek Maurya. All rights reserved.
          </p>

          {/* Connect Socials */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Abhi956967"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4.5 h-4.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/abhishek-maurya-3aa00223b"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4.5 h-4.5" />
            </a>
            <a
              href="mailto:am6007965@gmail.com"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              aria-label="Email"
            >
              <Mail className="w-4.5 h-4.5" />
            </a>
            <a
              href="tel:+919569671914"
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"
              aria-label="Phone"
            >
              <Phone className="w-4.5 h-4.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Floating scroll to top button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 text-white rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 z-50 flex items-center justify-center animate-fadeIn"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  )
}
