import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Features from './components/Features'
import TechStack from './components/TechStack'
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
    <div className="min-h-screen bg-white dark:bg-slate-955 relative">
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

      {showChat && user ? (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-100 dark:bg-slate-950 relative">
          <button
            onClick={() => setShowChat(false)}
            className="absolute top-4 left-4 p-2 bg-white dark:bg-slate-900 border dark:border-slate-800 hover:bg-primary-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 hover:text-primary-600 rounded-lg transition-all shadow-sm z-40"
            title="Back to home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 overflow-hidden p-3 md:p-4">
            <ChatWindow user={user} />
          </div>
        </div>
      ) : (
        <>
          <Hero setShowChat={handleLaunchAgent} />
          <Portfolio />
          <Features />
          <TechStack />
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
