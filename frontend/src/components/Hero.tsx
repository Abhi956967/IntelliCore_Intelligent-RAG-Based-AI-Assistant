import { useState, useEffect, useRef } from 'react'
import { 
  ArrowRight, 
  Bot, 
  FileText, 
  Zap, 
  Cpu, 
  Code2, 
  Database, 
  MapPin,
  ArrowDown,
  Activity,
  Workflow
} from 'lucide-react'

type Tab = 'chat' | 'rag' | 'metrics'

interface ChatMessage {
  sender: 'user' | 'assistant'
  text: string
  isStreaming?: boolean
}

const PROMPTS = {
  stack: {
    question: "What is Abhishek's core tech stack?",
    steps: ["Connecting to Vector DB...", "Querying ChromaDB index...", "Synthesizing tech profile..."],
    answer: "Abhishek's primary engineering stack includes Python, FastAPI, LangGraph, Docker, ChromaDB, AWS EC2, and MLflow for model tracking."
  },
  experience: {
    question: "Summarize his professional experience.",
    steps: ["Scanning resume embeddings...", "Found 2 matching experience nodes...", "Formatting summary..."],
    answer: "He is currently working as a Freelance AI Engineer developing GenAI apps and agents. Previously, he was a Business & Help Desk Analyst at Finnable Technologies (EDA, data cleaning, and reporting)."
  },
  projects: {
    question: "Tell me about his active AI projects.",
    steps: ["Retrieving project metadata...", "Parsing Network Security ML Pipeline details...", "Structuring project cards..."],
    answer: "He recently built a Network Security ML Pipeline (94% detection accuracy using Docker & MLflow) and a Multi-AI Agent Platform integrating Groq, LangGraph, and Tavily search."
  }
}

export default function Hero({ setShowChat }: { setShowChat: (show: boolean) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('chat')
  const [chatLogs, setChatLogs] = useState<ChatMessage[]>([
    { sender: 'user', text: 'Tell me about Abhishek from this resume.' },
    { sender: 'assistant', text: 'Abhishek Maurya is a Machine Learning Engineer and Freelance AI Developer building RAG apps, multi-agent systems, and FastAPI ML services.' }
  ])
  const [typingStatus, setTypingStatus] = useState<string>('')
  const [isTyping, setIsTyping] = useState<boolean>(false)
  const [metrics, setMetrics] = useState({ cpu: 12, ram: 42, latency: 84 })
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Fluctuating system metrics simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.max(5, Math.min(35, prev.cpu + Math.floor(Math.random() * 7) - 3)),
        ram: Math.max(38, Math.min(45, prev.ram + Math.floor(Math.random() * 3) - 1)),
        latency: Math.max(78, Math.min(92, prev.latency + Math.floor(Math.random() * 5) - 2))
      }))
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll chat window
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatLogs, typingStatus])

  const handlePromptClick = (key: keyof typeof PROMPTS) => {
    if (isTyping) return
    setIsTyping(true)
    
    const prompt = PROMPTS[key]
    
    // Add user message
    setChatLogs(prev => [...prev, { sender: 'user', text: prompt.question }])
    
    // Simulate thinking steps
    let stepIdx = 0
    setTypingStatus(prompt.steps[0])
    
    const stepInterval = setInterval(() => {
      stepIdx++
      if (stepIdx < prompt.steps.length) {
        setTypingStatus(prompt.steps[stepIdx])
      } else {
        clearInterval(stepInterval)
        setTypingStatus('')
        
        // Start streaming the answer
        let charIdx = 0
        const fullAnswer = prompt.answer
        setChatLogs(prev => [...prev, { sender: 'assistant', text: '', isStreaming: true }])
        
        const charInterval = setInterval(() => {
          setChatLogs(prev => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.sender === 'assistant') {
              last.text = fullAnswer.substring(0, charIdx + 1)
            }
            return next
          })
          charIdx++
          if (charIdx >= fullAnswer.length) {
            clearInterval(charInterval)
            setChatLogs(prev => {
              const next = [...prev]
              const last = next[next.length - 1]
              if (last && last.sender === 'assistant') {
                delete last.isStreaming
              }
              return next
            })
            setIsTyping(false)
          }
        }, 12)
      }
    }, 600)
  }

  const tags = [
    { label: 'Machine Learning Engineer', icon: Cpu },
    { label: 'Freelance AI Developer', icon: Code2 },
    { label: 'FastAPI + LangGraph', icon: Database },
    { label: 'Delhi, India', icon: MapPin }
  ]

  return (
    <section className="relative px-4 py-20 md:py-28 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_40%,#eff6ff_100%)] overflow-hidden bg-grid-glow">
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-slow-glow"></div>
      <div className="absolute top-1/3 right-[10%] w-96 h-96 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-slow-glow [animation-delay:4s]"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <div className="animate-slideUp">
          {/* System Status Badge */}
          <div className="inline-flex items-center gap-2 bg-slate-900 text-slate-100 px-4 py-2 rounded-full mb-6 border border-slate-800 shadow-md hover:border-slate-700 transition-all duration-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">Active: Groq + LangGraph + RAG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-950 mb-4 tracking-tight leading-[1.1]">
            Hi, I'm <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-cyan-500 bg-clip-text text-transparent">Abhishek Maurya</span>
          </h1>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-700 mb-6">
            Building Intelligent Agentic & ML Systems
          </h2>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
            A production-focused AI engineer specializing in autonomous agent workflows, document intelligence pipelines (RAG), and high-performance FastAPI microservices.
          </p>

          {/* Interactive Tag Grid */}
          <div className="flex flex-wrap gap-2.5 mb-10">
            {tags.map(({ label, icon: Icon }) => (
              <span 
                key={label} 
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-sm font-semibold shadow-sm transition-all duration-300 hover:shadow transform hover:-translate-y-0.5"
              >
                <Icon className="w-4 h-4 text-primary-500" />
                {label}
              </span>
            ))}
          </div>

          {/* Call-to-actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="group relative px-8 py-4 bg-slate-950 text-white rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-primary-200 hover:shadow-2xl flex items-center gap-2.5 justify-center transform hover:-translate-y-0.5 overflow-hidden z-10"
            >
              {/* Button gradient hover overlay */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-600 to-accent-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
              <Zap className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>Launch AI Agent</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="#portfolio"
              className="px-8 py-4 border border-slate-200 text-slate-800 hover:border-slate-300 hover:text-slate-950 hover:bg-slate-50 bg-white rounded-xl font-bold transition-all text-center shadow-sm hover:shadow"
            >
              Explore Projects
            </a>
          </div>
        </div>

        {/* Right Column: Premium Terminal Dashboard */}
        <div className="relative animate-float w-full max-w-lg lg:max-w-none mx-auto">
          {/* External decorative glow overlay */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 animate-tilt"></div>
          
          <div className="relative bg-slate-950 text-white border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Window header / tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2">
                {/* Simulated window control buttons */}
                <div className="flex gap-1.5 mr-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs tracking-wider text-slate-300">INTELLICORE-AGENT</span>
                </div>
              </div>
              
              {/* Tab Selector */}
              <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                {(['chat', 'rag', 'metrics'] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded-md capitalize font-semibold transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab === 'metrics' ? 'telemetry' : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Panel Body */}
            <div className="p-5 h-[340px] flex flex-col justify-between overflow-y-auto custom-scrollbar">
              
              {/* TAB 1: INTERACTIVE CHAT */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1 flex-1 mb-4 max-h-[220px]">
                    {chatLogs.map((msg, index) => (
                      <div 
                        key={index}
                        className={`p-3 rounded-xl border text-sm max-w-[90%] leading-relaxed flex flex-col ${
                          msg.sender === 'user'
                            ? 'bg-slate-900 border-slate-800 text-slate-300 self-end ml-auto'
                            : 'bg-cyan-950/20 border-cyan-500/20 text-slate-100 self-start'
                        }`}
                      >
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                          {msg.sender === 'user' ? 'User' : 'Assistant'}
                        </span>
                        <span>{msg.text}</span>
                      </div>
                    ))}
                    
                    {/* Live thinking steps indicator */}
                    {typingStatus && (
                      <div className="p-3 bg-slate-900/40 border border-slate-800/60 rounded-xl text-xs text-slate-400 flex items-center gap-2 self-start animate-pulse">
                        <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                        <span>{typingStatus}</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Quick prompts actions */}
                  <div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                      👉 Click a quick prompt to test reasoning:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(PROMPTS) as Array<keyof typeof PROMPTS>).map((key) => (
                        <button
                          key={key}
                          onClick={() => handlePromptClick(key)}
                          disabled={isTyping}
                          className="text-xs bg-slate-900 hover:bg-slate-800 border border-slate-850 hover:border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                          {key === 'stack' ? '🛠️ Core Stack' : key === 'experience' ? '💼 Work History' : '🚀 Key Projects'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RAG PIPELINE FLOW */}
              {activeTab === 'rag' && (
                <div className="flex-1 flex flex-col justify-center space-y-3">
                  <div className="border border-slate-800/80 bg-slate-900/30 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-sky-950/50 border border-sky-500/20 rounded-lg text-sky-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-sky-300 font-bold font-mono">1. PDF Chunk Parser</p>
                      <p className="text-[11px] text-slate-400">Extracted abhishek_resume.pdf into chunks</p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                  </div>

                  <div className="border border-slate-800/80 bg-slate-900/30 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-violet-950/50 border border-violet-500/20 rounded-lg text-violet-400">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-violet-300 font-bold font-mono">2. Vector Search (ChromaDB)</p>
                      <p className="text-[11px] text-slate-400">Dense embedding search with cosine distance metric</p>
                    </div>
                  </div>

                  <div className="flex justify-center -my-1.5">
                    <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
                  </div>

                  <div className="border border-slate-800/80 bg-slate-900/30 p-3 rounded-xl flex items-center gap-3">
                    <div className="p-2 bg-emerald-950/50 border border-emerald-500/20 rounded-lg text-emerald-400">
                      <Workflow className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs text-emerald-300 font-bold font-mono">3. Agent Loop (LangGraph)</p>
                      <p className="text-[11px] text-slate-400">RAG Context + Tavily Search {"->"} Llama-3 Reasoning</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: TELEMETRY AND METRICS */}
              {activeTab === 'metrics' && (
                <div className="flex-1 flex flex-col justify-between font-mono text-xs text-slate-300">
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="border border-slate-800/60 p-2.5 rounded-xl bg-slate-900/20">
                      <p className="text-[10px] text-slate-500 font-bold">LLM PROVIDER</p>
                      <p className="text-white font-bold mt-0.5">Groq Cloud API</p>
                    </div>
                    <div className="border border-slate-800/60 p-2.5 rounded-xl bg-slate-900/20">
                      <p className="text-[10px] text-slate-500 font-bold">ACTIVE LLM</p>
                      <p className="text-cyan-400 font-bold mt-0.5">Llama-3-70b</p>
                    </div>
                    <div className="border border-slate-800/60 p-2.5 rounded-xl bg-slate-900/20">
                      <p className="text-[10px] text-slate-500 font-bold">AVG LATENCY</p>
                      <p className="text-emerald-400 font-bold mt-0.5">{metrics.latency}ms</p>
                    </div>
                    <div className="border border-slate-800/60 p-2.5 rounded-xl bg-slate-900/20">
                      <p className="text-[10px] text-slate-500 font-bold">TOKENS / SEC</p>
                      <p className="text-violet-400 font-bold mt-0.5">842 t/s</p>
                    </div>
                  </div>

                  <div className="space-y-3.5 mt-4">
                    {/* CPU load bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold">
                        <span>CPU Utilisation</span>
                        <span>{metrics.cpu}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-sky-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${metrics.cpu}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* RAM load bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-slate-400 text-[10px] uppercase font-bold">
                        <span>Memory (RAM)</span>
                        <span>{metrics.ram}%</span>
                      </div>
                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${metrics.ram}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Status bar */}
              <div className="border-t border-slate-900 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>CONNECTED TO RAG SERVER</span>
                </div>
                <span>TEMP: 0.1</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
