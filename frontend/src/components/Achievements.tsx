import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Award, Briefcase, GraduationCap, GitCommit, Globe, Zap } from 'lucide-react'

// Helper Counter component
function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    let start = 0
    const duration = 1.5
    const stepTime = 16 // ~60fps
    const stepsCount = (duration * 1000) / stepTime
    const increment = Math.ceil(value / stepsCount)

    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, stepTime)

    return () => clearInterval(timer)
  }, [value, started])

  return (
    <motion.span
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true, margin: '-20px' }}
    >
      {count}{suffix}
    </motion.span>
  )
}

export default function Achievements() {
  const items = [
    {
      label: 'DSA Problems',
      value: 300,
      suffix: '+',
      desc: 'Solved across LeetCode, GFG & other platforms.',
      icon: Award,
      color: 'from-amber-500 to-orange-500',
      shadowColor: 'rgba(245,158,11,0.2)',
    },
    {
      label: 'AI Projects',
      value: 20,
      suffix: '+',
      desc: 'Built, containerized, and deployed ML/AI products.',
      icon: Briefcase,
      color: 'from-blue-500 to-indigo-500',
      shadowColor: 'rgba(59,130,246,0.2)',
    },
    {
      label: 'Certifications',
      value: 10,
      suffix: '+',
      desc: 'Covering Data Science, Generative AI, & Cloud platforms.',
      icon: GraduationCap,
      color: 'from-cyan-500 to-sky-500',
      shadowColor: 'rgba(6,182,212,0.2)',
    },
    {
      label: 'Commits',
      value: 1000,
      suffix: '+',
      desc: 'Pushes, contributions, and documentation edits.',
      icon: GitCommit,
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'rgba(16,185,129,0.2)',
    },
    {
      label: 'Deployments',
      value: 5,
      suffix: '+',
      desc: 'Dockerized microservices hosted on AWS and Render.',
      icon: Globe,
      color: 'from-rose-500 to-pink-500',
      shadowColor: 'rgba(244,63,94,0.2)',
    },
    {
      label: 'Consistency',
      value: 100,
      suffix: '%',
      desc: 'Daily code pushes, learning cycles, and testing iterations.',
      icon: Zap,
      color: 'from-purple-500 to-fuchsia-500',
      shadowColor: 'rgba(168,85,247,0.2)',
    },
  ]

  return (
    <section id="achievements" className="py-24 px-4 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Block */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            🏆 Key Achievements
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Milestones & Accomplishments
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Consistently delivering quality software updates and pushing the boundaries of autonomous systems engineering.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
          {items.map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="group relative p-5 rounded-2xl glassmorphism-card border border-slate-200/50 dark:border-slate-800/40 hover-glow hover:shadow-2xl transition-all duration-300 flex flex-col justify-between text-center select-none"
                style={{
                  boxShadow: `0 10px 30px -15px ${item.shadowColor}`
                }}
              >
                <div className="space-y-4">
                  {/* Icon Wrapper */}
                  <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>

                  {/* Counter */}
                  <h3 className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    <Counter value={item.value} suffix={item.suffix} />
                  </h3>

                  {/* Label */}
                  <p className="text-xs font-extrabold text-slate-900 dark:text-slate-200 uppercase tracking-wider">
                    {item.label}
                  </p>

                  {/* Description */}
                  <p className="text-[10px] text-slate-550 dark:text-slate-400 leading-normal font-medium">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
