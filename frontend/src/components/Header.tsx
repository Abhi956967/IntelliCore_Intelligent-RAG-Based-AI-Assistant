import { Brain, Github, Linkedin, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface UserSession {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

interface HeaderProps {
  user: UserSession | null
  onLoginClick: () => void
  onSignUpClick: () => void
  onSettingsClick: () => void
}

export default function Header({ user, onLoginClick, onSignUpClick, onSettingsClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Features', href: '#features' },
    { label: 'Tech Stack', href: '#technology' },
  ]

  return (
    <header className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-900 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl group-hover:shadow-lg group-hover:shadow-primary-200 transition-all transform group-hover:scale-105">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">IntelliCore</h1>
              <p className="text-xs text-slate-500 font-medium">Intelligent RAG AI</p>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-slate-600 dark:text-slate-350 hover:text-primary-600 transition-colors text-sm font-semibold relative group"
              >
                {link.label}
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-primary-600 to-accent-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            ))}
          </nav>

          {/* User Auth, Settings, & Social links */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <a
                href="https://github.com/Abhi956967"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-900 rounded-lg transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-maurya-3aa00223b"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-900 rounded-lg transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></span>

            {/* Authentication / Settings Trigger */}
            {user ? (
              <button
                onClick={onSettingsClick}
                className="flex items-center gap-2 focus:outline-none hover:scale-[1.03] active:scale-[0.97] transition-all"
                title="Workspace settings"
              >
                <img src={user.avatar_url} alt={user.name} className="w-8 h-8 rounded-full border border-slate-250 dark:border-slate-800 bg-slate-950 shadow-sm" />
                <span className="hidden lg:block text-xs font-bold text-slate-700 dark:text-slate-300 truncate max-w-[90px]">{user.name}</span>
              </button>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={onLoginClick}
                  className="text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary-600 transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-4 py-2 border border-slate-900 dark:border-slate-300 text-slate-900 dark:text-slate-100 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Sign up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-slate-200 dark:border-slate-900 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-900 rounded-lg transition-colors text-sm font-semibold"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
