import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Features from './components/Features'
import TechStack from './components/TechStack'
import Portfolio from './components/Portfolio'
import SystemArchitecture from './components/SystemArchitecture'
import GitHubDashboard from './components/GitHubDashboard'
import Achievements from './components/Achievements'
import CodingJourney from './components/CodingJourney'
import Testimonials from './components/Testimonials'
import Blog from './components/Blog'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'
import ChatWindow from './components/ChatWindow'
import AuthWindow from './components/AuthWindow'
import SettingsModal from './components/SettingsModal'

interface UserSession {
  id: string
  name: string
  email: string
  avatar_url: string
  created_at: string
}

export default function App() {
  const [showChat, setShowChat] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authInitialMode, setAuthInitialMode] = useState<'signin' | 'signup' | 'forgot'>('signin')

  const [user, setUser] = useState<UserSession | null>(() => {
    const cached = localStorage.getItem('intellicore.session')
    if (cached) {
      try {
        const sessionUser = JSON.parse(cached)
        if (sessionUser && sessionUser.avatar_url && sessionUser.avatar_url.includes('bottts')) {
          sessionUser.avatar_url = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(sessionUser.name || sessionUser.email)}`
          localStorage.setItem('intellicore.session', JSON.stringify(sessionUser))
        }
        return sessionUser
      } catch (e) {
        return null
      }
    }
    return null
  })

  // Sync dark theme on app mount
  useEffect(() => {
    const syncTheme = () => {
      const cachedTheme = localStorage.getItem('intellicore.theme')
      const root = document.documentElement
      if (cachedTheme === 'dark' || (!cachedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.classList.add('dark')
        localStorage.setItem('intellicore.theme', 'dark')
      } else {
        root.classList.remove('dark')
        localStorage.setItem('intellicore.theme', 'light')
      }
    }

    syncTheme()

    // Sync theme on clicks (handles theme toggles inside ChatWindow)
    document.addEventListener('click', syncTheme)
    return () => document.removeEventListener('click', syncTheme)
  }, [])

  const handleLogin = (sessionUser: UserSession) => {
    localStorage.setItem('intellicore.session', JSON.stringify(sessionUser))
    setUser(sessionUser)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    localStorage.removeItem('intellicore.session')
    setUser(null)
    setShowSettingsModal(false)
    setShowChat(false)
  }

  const handleUpdateUser = (updatedUser: UserSession) => {
    localStorage.setItem('intellicore.session', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const isDark = localStorage.getItem('intellicore.theme') === 'dark'

  const handleLaunchAgent = () => {
    if (!user) {
      setAuthInitialMode('signin')
      setShowAuthModal(true)
    } else {
      setShowChat(true)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 relative">
      {!showChat && (
        <Header 
          user={user}
          onLoginClick={() => {
            setAuthInitialMode('signin')
            setShowAuthModal(true)
          }}
          onSignUpClick={() => {
            setAuthInitialMode('signup')
            setShowAuthModal(true)
          }}
          onSettingsClick={() => setShowSettingsModal(true)}
        />
      )}

      {showChat && user ? (
        <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-955 relative animate-fadeIn">
          {/* Top Bar for Back button */}
          <div className="h-14 px-4 border-b bg-white dark:bg-slate-900 flex items-center justify-between border-slate-200 dark:border-slate-800 z-50">
            <button
              onClick={() => setShowChat(false)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border border-slate-200/50 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700"
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio</span>
            </button>
            <div className="flex items-center gap-2 select-none">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">IntelliCore AI Session</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden p-3 md:p-4">
            <ChatWindow user={user} />
          </div>
        </div>
      ) : (
        <>
          <Hero setShowChat={handleLaunchAgent} />
          <Features />
          <TechStack />
          <Portfolio />
          <SystemArchitecture />
          <GitHubDashboard />
          <Achievements />
          <CodingJourney />
          <Testimonials />
          <Blog />
          <ContactSection />
          <Footer />
        </>
      )}

      {/* Auth Modal Popup Overlay */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md">
            <button 
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 dark:hover:text-white z-50 font-bold text-lg p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Authentication"
            >
              ✕
            </button>
            <AuthWindow 
              onLogin={handleLogin} 
              darkMode={isDark} 
              initialMode={authInitialMode}
            />
          </div>
        </div>
      )}

      {/* Settings Modal Popup Overlay */}
      {showSettingsModal && user && (
        <SettingsModal 
          user={user}
          onClose={() => setShowSettingsModal(false)}
          onLogout={handleLogout}
          onUpdateUser={handleUpdateUser}
          darkMode={isDark}
        />
      )}
    </div>
  )
}
