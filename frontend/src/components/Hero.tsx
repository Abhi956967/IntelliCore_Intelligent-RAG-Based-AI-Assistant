import { useState, useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { Zap, Github, FileText, Play, Cpu, Server, Network } from 'lucide-react'

// Helper for animated counters that trigger when visible
function Counter({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1)
      const currentCount = Math.floor(progress * value)
      setCount(currentCount)
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    };
    window.requestAnimationFrame(step)
  }, [value, duration, started])

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, margin: '-50px' }}
    >
      {count}
    </motion.span>
  )
}

export default function Hero({ setShowChat }: { setShowChat: (show: boolean) => void }) {
  // Mouse Glow effect tracker
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  // Typing headline animation
  const roles = [
    "Machine Learning Engineer",
    "Generative AI Engineer",
    "FastAPI & LangGraph Specialist",
    "Autonomous Agent Architect"
  ]
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [typingSpeed, setTypingSpeed] = useState(100)

  useEffect(() => {
    let timer: any
    const fullText = roles[currentRoleIndex]

    const handleType = () => {
      if (!isDeleting) {
        setCurrentText(fullText.substring(0, currentText.length + 1))
        setTypingSpeed(80)

        if (currentText === fullText) {
          timer = setTimeout(() => setIsDeleting(true), 2000) // Hold word
          return
        }
      } else {
        setCurrentText(fullText.substring(0, currentText.length - 1))
        setTypingSpeed(45)

        if (currentText === '') {
          setIsDeleting(false)
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length)
          setTypingSpeed(150)
          return
        }
      }

      timer = setTimeout(handleType, typingSpeed)
    }

    timer = setTimeout(handleType, typingSpeed)
    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentRoleIndex])

  // Stat item array
  const stats = [
    { label: 'DSA Problems Solved', value: 300, suffix: '+' },
    { label: 'AI Projects Built', value: 20, suffix: '+' },
    { label: 'Certifications', value: 10, suffix: '+' },
    { label: 'Deployments', value: 5, suffix: '+' },
    { label: 'GitHub Commits', value: 1000, suffix: '+' },
  ]

  // Floating nodes list for right column
  const floatingLabels = [
    { name: 'RAG Pipeline', color: 'from-cyan-500 to-blue-500', x: '15%', y: '15%', delay: 0 },
    { name: 'LangGraph', color: 'from-violet-500 to-fuchsia-500', x: '82%', y: '20%', delay: 0.5 },
    { name: 'Groq', color: 'from-amber-500 to-orange-500', x: '10%', y: '75%', delay: 1 },
    { name: 'Gemini', color: 'from-blue-500 to-indigo-600', x: '80%', y: '78%', delay: 1.5 },
    { name: 'Multi-LLM', color: 'from-emerald-500 to-teal-500', x: '18%', y: '45%', delay: 2 },
    { name: 'Vector Search', color: 'from-sky-500 to-cyan-500', x: '78%', y: '50%', delay: 2.5 },
    { name: 'Memory', color: 'from-rose-500 to-pink-500', x: '46%', y: '10%', delay: 3 },
    { name: 'AI Agent', color: 'from-purple-500 to-indigo-500', x: '48%', y: '88%', delay: 3.5 },
  ]

  return (
    <section
      id="home"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen pt-24 pb-16 px-4 flex items-center bg-white dark:bg-slate-950 overflow-hidden bg-aurora bg-grid-glow group"
    >
      {/* Dynamic Cursor Glow Tracker */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(14, 165, 233, 0.12),
              transparent 80%
            )
          `
        }}
      />

      {/* Floating Decorative Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 blur-xl"
            style={{
              width: Math.random() * 150 + 100,
              height: Math.random() * 150 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * 40 - 20, 0],
              x: [0, Math.random() * 40 - 20, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">
        {/* Left Column */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 text-left"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-350">
              Available For Hire
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.08]">
            Build Intelligent <br />
            <span className="bg-gradient-to-r from-primary-600 via-accent-500 to-cyan-500 dark:from-primary-400 dark:via-accent-400 dark:to-cyan-400 bg-clip-text text-transparent">
              AI Agents
            </span> with RAG, <br />
            Multi-LLM & LangGraph
          </h1>

          {/* Typed Role */}
          <div className="h-8 flex items-center">
            <p className="text-lg sm:text-xl font-semibold text-slate-600 dark:text-slate-400">
              I am a <span className="text-primary-600 dark:text-cyan-400 font-bold cursor-blink">{currentText}</span>
            </p>
          </div>

          {/* Intro Description */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
            I build production-ready AI applications with modern technologies, multi-LLM support, vector databases, and intelligent orchestration workflows.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap gap-3.5 pt-2">
            {/* Launch AI Agent */}
            <button
              onClick={() => setShowChat(true)}
              className="group relative px-6 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-sm transition-all duration-300 shadow-md hover:shadow-primary-500/20 hover:shadow-xl hover:scale-[1.02] flex items-center gap-2 overflow-hidden"
            >
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
              <span>Launch AI Agent</span>
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/Abhi956967"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02]"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>

            {/* Resume */}
            <a
              href="#contact"
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02]"
            >
              <FileText className="w-4 h-4 text-primary-500" />
              <span>Resume</span>
            </a>

            {/* Live Demo */}
            <button
              onClick={() => setShowChat(true)}
              className="px-5 py-3.5 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/50 dark:border-slate-800 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-sm hover:scale-[1.02]"
            >
              <Play className="w-4 h-4 text-emerald-500 fill-emerald-500/20" />
              <span>Live Demo</span>
            </button>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap gap-2 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 shadow-sm">
              <Cpu className="w-3.5 h-3.5 text-primary-500" />
              AI Engineer
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 shadow-sm">
              <Server className="w-3.5 h-3.5 text-cyan-500" />
              Full Stack Developer
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-xs font-semibold text-slate-600 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800 shadow-sm">
              <Network className="w-3.5 h-3.5 text-purple-500" />
              Problem Solver
            </span>
          </div>

          {/* Counters Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 pt-6 border-t border-slate-250/20 dark:border-slate-800/40">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1 text-center sm:text-left">
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
                  <Counter value={stat.value} />
                  <span className="text-primary-500 dark:text-cyan-400">{stat.suffix}</span>
                </p>
                <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 leading-tight">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Premium Brain Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative flex items-center justify-center h-[420px] sm:h-[480px] w-full max-w-[480px] lg:max-w-none mx-auto"
        >
          {/* Animated Central Core */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Pulsing Back Glow */}
            <div className="absolute w-[240px] h-[240px] rounded-full bg-gradient-to-r from-primary-500 to-accent-500 blur-[80px] opacity-25 animate-pulse-glow" />

            {/* Spinning Orbital Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[280px] h-[280px] rounded-full border border-dashed border-primary-500/20 dark:border-cyan-500/10"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-accent-500/25 dark:border-purple-500/10"
            />
          </div>

          {/* Central Interactive Network / Brain representation */}
          <div className="relative w-[280px] h-[280px] bg-slate-900/5 dark:bg-slate-900/40 rounded-full border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-md flex items-center justify-center animate-float shadow-xl">
            {/* Pulsating brain image or SVG */}
            <svg
              className="w-40 h-40 text-primary-500 dark:text-cyan-400 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Left hemisphere */}
              <path d="M12 22c-1.5 0-3-1-3.5-2.5C8 18 7 17 5.5 16.5 4 16 3 15 3 13.5c0-2.5 1.5-4 3-4C7 8.5 7.5 7 9 6.5 10 6 11 4.5 12 4.5" />
              <path d="M12 4.5V22" />
              <path d="M9 6.5C9 5 10 4 11 3.5" />
              <path d="M6.5 9.5c0-1 1-2 2.5-3" />
              <path d="M5.5 16.5C6 15 7 14 8.5 14" />

              {/* Right hemisphere */}
              <path d="M12 22c1.5 0 3-1 3.5-2.5.5-1.5 1.5-2.5 3-3C20 16 21 15 21 13.5c0-2.5-1.5-4-3-4 0-1-.5-2.5-2-3-1-.5-2-2-3-2" />
              <path d="M15 6.5C15 5 14 4 13 3.5" />
              <path d="M17.5 9.5c0-1-1-2-2.5-3" />
              <path d="M18.5 16.5c-.5-1.5-1.5-2.5-3-2.5" />

              {/* Synapses connections */}
              <circle cx="12" cy="4.5" r="1" fill="currentColor" />
              <circle cx="9" cy="6.5" r="1" fill="currentColor" />
              <circle cx="15" cy="6.5" r="1" fill="currentColor" />
              <circle cx="6.5" cy="9.5" r="1" fill="currentColor" />
              <circle cx="17.5" cy="9.5" r="1" fill="currentColor" />
              <circle cx="5.5" cy="16.5" r="1" fill="currentColor" />
              <circle cx="18.5" cy="16.5" r="1" fill="currentColor" />
              <circle cx="12" cy="22" r="1" fill="currentColor" />
            </svg>

            {/* Glowing inner core */}
            <div className="absolute w-12 h-12 rounded-full bg-cyan-400/20 dark:bg-cyan-500/20 blur-md animate-ping" />
          </div>

          {/* Floating labels with connectors */}
          {floatingLabels.map((node) => (
            <motion.div
              key={node.name}
              className="absolute pointer-events-auto"
              style={{ left: node.x, top: node.y }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: [0, -8, 0]
              }}
              transition={{
                delay: node.delay,
                duration: 5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <div className="relative group/node cursor-pointer">
                {/* Node Glass Badge */}
                <div className="px-3.5 py-2 rounded-full bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 hover:border-primary-400 dark:hover:border-cyan-400 shadow-md transition-all flex items-center gap-1.5 hover:scale-105 active:scale-95">
                  <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
                  <span className="text-[10px] sm:text-xs font-bold text-slate-800 dark:text-slate-200">
                    {node.name}
                  </span>
                </div>

                {/* Connector dot */}
                <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-cyan-500 opacity-0 group-hover/node:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
