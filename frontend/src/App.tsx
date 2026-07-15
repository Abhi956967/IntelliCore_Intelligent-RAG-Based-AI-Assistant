import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Header from './components/Header'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Features from './components/Features'
import TechStack from './components/TechStack'
import Footer from './components/Footer'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const [showChat, setShowChat] = useState(false)

  if (showChat) {
    return (
      <div className="flex flex-col h-screen bg-slate-100">
        <Header />
        <button
          onClick={() => setShowChat(false)}
          className="absolute top-20 left-4 p-2 bg-white hover:bg-primary-50 text-slate-600 hover:text-primary-600 rounded-lg transition-all shadow-sm z-40"
          title="Back to home"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 overflow-hidden">
          <div className="h-full w-full p-3 md:p-4">
            <ChatWindow />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero setShowChat={setShowChat} />
      <Portfolio />
      <Features />
      <TechStack />

      <section className="py-20 px-4 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-primary-500 to-violet-500"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Ready to talk to IntelliCore?</h2>
          <p className="text-lg md:text-xl opacity-95 mb-10 leading-relaxed">
            Upload a resume, ask about projects, search the web, or let the agent reason through your next AI workflow.
          </p>
          <button
            onClick={() => setShowChat(true)}
            className="px-10 py-4 bg-white text-slate-950 hover:text-primary-700 hover:bg-slate-50 rounded-lg font-bold transition-all transform hover:-translate-y-0.5 shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
          >
            Launch Chat Interface
          </button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
