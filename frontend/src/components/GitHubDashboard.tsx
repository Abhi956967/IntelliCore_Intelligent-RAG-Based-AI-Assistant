import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GitPullRequest, Star, Users, Folder, Code } from 'lucide-react'

// Helper for animating count counters
function Counter({ value }: { value: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    if (!started) return
    let start = 0
    const timer = setInterval(() => {
      start += Math.ceil(value / 60)
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 25)
    return () => clearInterval(timer)
  }, [value, started])

  return (
    <motion.span 
      onViewportEnter={() => setStarted(true)}
      viewport={{ once: true }}
    >
      {count}
    </motion.span>
  )
}

export default function GitHubDashboard() {
  // Generate random GitHub contribution grid intensities
  const gridRows = 7
  const gridCols = 53
  const [contributions, setContributions] = useState<number[][]>([])

  useEffect(() => {
    // Generate a fixed matrix of values (0 to 4) representing commit intensity
    const matrix: number[][] = []
    for (let r = 0; r < gridRows; r++) {
      const row: number[] = []
      for (let c = 0; c < gridCols; c++) {
        // Higher probability of commits on middle columns/weekdays, random factor
        const baseProb = Math.random() * 100
        let level = 0
        if (baseProb > 88) level = 4
        else if (baseProb > 70) level = 3
        else if (baseProb > 45) level = 2
        else if (baseProb > 20) level = 1
        row.push(level)
      }
      matrix.push(row)
    }
    setContributions(matrix)
  }, [])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const stats = [
    { label: 'Repositories', value: 50, icon: Folder, color: 'text-blue-500' },
    { label: 'Stars Earned', value: 1200, icon: Star, color: 'text-amber-500' },
    { label: 'Followers', value: 350, icon: Users, color: 'text-purple-500' },
    { label: 'Commits', value: 1000, icon: GitPullRequest, color: 'text-emerald-500' },
  ]

  const languages = [
    { name: 'Python', percent: 45, color: 'bg-blue-500' },
    { name: 'TypeScript', percent: 25, color: 'bg-emerald-500' },
    { name: 'JavaScript', percent: 17, color: 'bg-yellow-500' },
    { name: 'Other', percent: 13, color: 'bg-purple-500' }
  ]

  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden bg-grid-glow">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
            🐙 Open Source Activity
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            GitHub Dashboard Overview
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Real-time developer footprint, open source repositories contribution metrics, and language allocations.
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Block: Stats Counter Cards */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-5 rounded-2xl glassmorphism-card border border-slate-200/50 dark:border-slate-800/40 hover-glow transition-all flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</span>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <p className="text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    <Counter value={stat.value} />
                    <span className="text-primary-500 dark:text-cyan-400">+</span>
                  </p>
                </motion.div>
              )
            })}
          </div>

          {/* Right Block: Contribution Heatmap and Languages */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heatmap Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xl overflow-x-auto"
            >
              <div className="flex justify-between items-center mb-4 min-w-[500px]">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">Contribution Graph</h3>
                <span className="text-[10px] text-slate-400 font-semibold">1,234 contributions in the last year</span>
              </div>

              {/* Grid representation */}
              <div className="min-w-[580px] space-y-1.5">
                {/* Month labels */}
                <div className="flex pl-8 text-[9px] text-slate-400 font-bold mb-1 justify-between select-none">
                  {months.map(m => <span key={m} className="w-10 text-left">{m}</span>)}
                </div>

                <div className="flex gap-2">
                  {/* Day labels */}
                  <div className="flex flex-col justify-between text-[8px] text-slate-450 dark:text-slate-500 font-bold h-[95px] pr-2 pt-1 select-none">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                  </div>

                  {/* Contributions dots grid */}
                  <div className="flex-1 grid grid-flow-col gap-1 auto-cols-max">
                    {contributions.map((row, rIdx) => 
                      row.map((level, cIdx) => (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          className={`w-[11px] h-[11px] rounded-sm transition-all duration-300 ${
                            level === 0 ? 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-200' :
                            level === 1 ? 'bg-emerald-500/20 dark:bg-emerald-500/10 hover:scale-110' :
                            level === 2 ? 'bg-emerald-500/40 dark:bg-emerald-500/30 hover:scale-110' :
                            level === 3 ? 'bg-emerald-500/70 dark:bg-emerald-500/60 hover:scale-110' :
                            'bg-emerald-500 dark:bg-emerald-400 hover:scale-110'
                          }`}
                          title={`Level ${level} commits`}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Heatmap Legend */}
                <div className="flex justify-end items-center gap-1.5 text-[9px] text-slate-400 font-bold pt-3 select-none">
                  <span>Less</span>
                  <div className="w-[11px] h-[11px] rounded-sm bg-slate-100 dark:bg-slate-850" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500/20 dark:bg-emerald-500/10" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500/40 dark:bg-emerald-500/30" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500/70 dark:bg-emerald-500/60" />
                  <div className="w-[11px] h-[11px] rounded-sm bg-emerald-500 dark:bg-emerald-400" />
                  <span>More</span>
                </div>
              </div>
            </motion.div>

            {/* Top Languages Card */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <Code className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-200">Top Languages</h3>
              </div>

              {/* Combined Progress Bar */}
              <div className="w-full h-3 rounded-full flex overflow-hidden mb-6">
                {languages.map(lang => (
                  <div
                    key={lang.name}
                    className={`${lang.color} h-full`}
                    style={{ width: `${lang.percent}%` }}
                    title={`${lang.name} ${lang.percent}%`}
                  />
                ))}
              </div>

              {/* Languages Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {languages.map(lang => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`} />
                    <div>
                      <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{lang.name}</p>
                      <p className="text-[10px] text-slate-400 font-semibold">{lang.percent}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
