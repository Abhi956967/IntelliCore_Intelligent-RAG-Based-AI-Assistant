import { useState, useEffect } from 'react'
import { Brain, Github, Linkedin, Menu, X, Sun, Moon, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const localTheme = localStorage.getItem('intellicore.theme')
    if (localTheme === 'light' || localTheme === 'dark') {
      return localTheme
    }
    return 'dark' // Default to dark for premium look
  })

  // Detect scroll to apply sticky styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }

      // Determine active section
      const sections = ['home', 'features', 'portfolio', 'blog', 'about', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const offsetTop = el.offsetTop
          const offsetHeight = el.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Run initially
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sync theme with HTML class and localStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('intellicore.theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  const navLinks = [
    { label: 'Home', href: '#home', id: 'home' },
    { label: 'Features', href: '#features', id: 'features' },
    { label: 'Projects', href: '#portfolio', id: 'portfolio' },
    { label: 'Blog', href: '#blog', id: 'blog' },
    { label: 'About', href: '#achievements', id: 'about' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ]

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-900/50 py-3 shadow-lg shadow-slate-100/10 dark:shadow-black/20' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 rounded-xl shadow-md shadow-primary-500/20 group-hover:shadow-lg group-hover:shadow-primary-500/30 transition-all transform group-hover:scale-105">
              <Brain className="w-5.5 h-5.5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 dark:from-primary-400 dark:to-cyan-400 bg-clip-text text-transparent tracking-tight">
                IntelliCore
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                Intelligent RAG AI
              </p>
            </div>
          </div>

          {/* Nav Links - Desktop */}
          <nav className="hidden md:flex items-center gap-6 bg-slate-100/80 dark:bg-slate-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-slate-200/50 dark:border-slate-800/40 shadow-inner">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-xs font-bold tracking-wide transition-colors relative px-3 py-1 rounded-full ${
                  activeSection === link.id
                    ? 'text-primary-600 dark:text-cyan-400 bg-white dark:bg-slate-800 shadow-sm border border-slate-200/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-800"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-cyan-400" /> : <Moon className="w-4.5 h-4.5 text-amber-500" />}
            </button>

            {/* Social Links - Desktop */}
            <div className="hidden lg:flex items-center gap-1.5">
              <a
                href="https://github.com/Abhi956967"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-4.5 h-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/abhishek-maurya-3aa00223b"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-cyan-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4.5 h-4.5" />
              </a>
            </div>

            {/* Resume Button */}
            <a
              href="#contact"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-500 hover:to-accent-500 rounded-xl transition-all shadow-md shadow-primary-500/10 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resume</span>
            </a>

            <span className="h-5 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></span>

            {/* Auth / Settings Trigger */}
            {user ? (
              <button
                onClick={onSettingsClick}
                className="flex items-center gap-2 focus:outline-none hover:scale-[1.03] active:scale-[0.97] transition-all"
                title="Workspace settings"
              >
                <img 
                  src={user.avatar_url} 
                  alt={user.name} 
                  className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-sm" 
                />
                <span className="hidden xl:block text-xs font-bold text-slate-700 dark:text-slate-350 truncate max-w-[80px]">
                  {user.name}
                </span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onLoginClick}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-primary-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Log In
                </button>
                <button
                  onClick={onSignUpClick}
                  className="px-3.5 py-1.5 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-500 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all border border-slate-200 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-900 px-4 py-4 space-y-2.5 shadow-lg"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2 text-sm font-bold rounded-xl transition-all ${
                  activeSection === link.id
                    ? 'text-primary-600 dark:text-cyan-400 bg-slate-50 dark:bg-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-900 px-4">
              <div className="flex gap-4">
                <a
                  href="https://github.com/Abhi956967"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/abhishek-maurya-3aa00223b"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl shadow-md shadow-primary-500/10"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
