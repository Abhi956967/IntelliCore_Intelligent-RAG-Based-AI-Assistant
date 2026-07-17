import { useState } from 'react'
import { Bot, Mail, Lock, User, ArrowRight, Github, Chrome, ShieldAlert, Sparkles, KeyRound } from 'lucide-react'

type AuthMode = 'signin' | 'signup' | 'forgot'

interface UserSession {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

interface AuthWindowProps {
  onLogin: (user: UserSession) => void
  darkMode: boolean
  initialMode?: AuthMode
}

export default function AuthWindow({ onLogin, darkMode, initialMode = 'signin' }: AuthWindowProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  
  // Validation and UI states
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  }

  const handleOAuth = (provider: 'Google' | 'GitHub') => {
    setLoading(true)
    setError('')
    // Simulate OAuth Callback
    setTimeout(() => {
      const mockUser: UserSession = {
        id: `usr_${Math.random().toString(36).substr(2, 9)}`,
        name: provider === 'Google' ? 'Google Developer' : 'GitHub Contributor',
        email: `${provider.toLowerCase()}@intellicore.ai`,
        avatar_url: provider === 'Google' 
          ? 'https://api.dicebear.com/7.x/initials/svg?seed=google' 
          : 'https://api.dicebear.com/7.x/initials/svg?seed=github',
        created_at: new Date().toISOString()
      }
      setLoading(false)
      onLogin(mockUser)
    }, 1200)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (mode === 'signin') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      
      setLoading(true)
      // Simulate API auth
      setTimeout(() => {
        setLoading(false)
        const mockUser: UserSession = {
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: email.split('@')[0].toUpperCase(),
          email: email,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(email.split('@')[0])}`,
          created_at: new Date().toISOString()
        }
        onLogin(mockUser)
      }, 1000)
    } else if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }

      setLoading(true)
      // Simulate API registration
      setTimeout(() => {
        setLoading(false)
        const mockUser: UserSession = {
          id: `usr_${Math.random().toString(36).substr(2, 9)}`,
          name: name.trim(),
          email: email,
          avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          created_at: new Date().toISOString()
        }
        onLogin(mockUser)
      }, 1200)
    } else if (mode === 'forgot') {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setSuccess('Password reset link has been dispatched to your email address!')
        setEmail('')
      }, 1000)
    }
  }

  const cardBg = darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
  const textPrimary = darkMode ? 'text-white' : 'text-slate-900'
  const textSecondary = darkMode ? 'text-slate-400' : 'text-slate-600'
  const inputBg = darkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${darkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Decorative glows in background */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className={`w-full max-w-md border rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl ${cardBg}`}>
        
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-8 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 text-white flex items-center justify-center mb-4 shadow shadow-primary-500/30">
            <Bot className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className={`text-2xl font-extrabold tracking-tight ${textPrimary}`}>
            {mode === 'signin' && 'Welcome to IntelliCore'}
            {mode === 'signup' && 'Create account'}
            {mode === 'forgot' && 'Reset your password'}
          </h2>
          <p className={`text-xs mt-1 font-semibold uppercase tracking-wider ${textSecondary}`}>
            {mode === 'signin' && 'Sign in to access your AI pipeline'}
            {mode === 'signup' && 'Deploy your workspace session'}
            {mode === 'forgot' && 'Recover account access credentials'}
          </p>
        </div>

        {/* Action Status Banners */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-500/15 border border-red-500/20 rounded-xl text-red-500 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-500/15 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Forms */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 ${inputBg}`}
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Email address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 ${inputBg}`}
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Password</label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
                    className="text-xs text-primary-500 hover:underline font-semibold"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 ${inputBg}`}
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className={`text-xs font-bold uppercase tracking-wider ${textSecondary}`}>Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:border-primary-500 ${inputBg}`}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold text-sm shadow transition-all disabled:opacity-50 mt-6"
          >
            {loading ? (
              <LoaderSpinner />
            ) : (
              <>
                <span>
                  {mode === 'signin' && 'Sign In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send recovery link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Auth Mode Toggle Link */}
        <div className="mt-6 text-center text-sm relative z-10">
          {mode === 'signin' && (
            <p className={textSecondary}>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(''); setSuccess(''); }} className="text-primary-500 font-bold hover:underline">
                Sign Up
              </button>
            </p>
          )}
          {mode === 'signup' && (
            <p className={textSecondary}>
              Already have an account?{' '}
              <button onClick={() => { setMode('signin'); setError(''); setSuccess(''); }} className="text-primary-500 font-bold hover:underline">
                Sign In
              </button>
            </p>
          )}
          {mode === 'forgot' && (
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
              className="text-primary-500 font-bold hover:underline text-xs flex items-center gap-1 mx-auto"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          )}
        </div>

        {/* OAuth Social Dividers & Buttons */}
        {mode !== 'forgot' && (
          <div className="mt-8 relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className={`h-px flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></span>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${textSecondary}`}>Or continue with</span>
              <span className={`h-px flex-1 ${darkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('Google')}
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all hover:bg-slate-500/5 ${
                  darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Chrome className="w-4 h-4 text-red-500" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('GitHub')}
                disabled={loading}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-xs font-bold transition-all hover:bg-slate-500/5 ${
                  darkMode ? 'border-slate-800 hover:border-slate-700' : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function LoaderSpinner() {
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
      <span className="text-xs">Authenticating...</span>
    </div>
  )
}
