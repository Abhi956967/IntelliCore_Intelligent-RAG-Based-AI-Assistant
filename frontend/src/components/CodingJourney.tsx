import { motion } from 'framer-motion'
import { ChevronRight, Calendar, Bookmark } from 'lucide-react'

interface Milestone {
  year: string
  title: string
  desc: string
  iconColor: string
}

export default function CodingJourney() {
  const milestones: Milestone[] = [
    {
      year: '2021',
      title: 'Started with Python',
      desc: 'Learned fundamentals, OOP concepts, automation scripting, and logic building.',
      iconColor: 'bg-blue-500 shadow-blue-500/20',
    },
    {
      year: '2022',
      title: 'Data Structures & Algorithms',
      desc: 'Mastered Arrays, Lists, Trees, Graphs, Sorting, and Searching complexities.',
      iconColor: 'bg-indigo-500 shadow-indigo-500/20',
    },
    {
      year: '2022',
      title: 'Data Science & Machine Learning',
      desc: 'Pandas, NumPy, Scikit-Learn, Regression models, and EDA classification processes.',
      iconColor: 'bg-cyan-500 shadow-cyan-500/20',
    },
    {
      year: '2023',
      title: 'Deep Learning & NLP',
      desc: 'Neural Networks, PyTorch, text classification, and embedding similarity models.',
      iconColor: 'bg-purple-500 shadow-purple-500/20',
    },
    {
      year: '2023',
      title: 'Full Stack Development',
      desc: 'FastAPI microservices, React frontends, Docker environments, and SQL schemas.',
      iconColor: 'bg-emerald-500 shadow-emerald-500/20',
    },
    {
      year: '2024',
      title: 'RAG & LangChain Projects',
      desc: 'ChromaDB indexing, dense embeddings search, and semantic document grounding.',
      iconColor: 'bg-rose-500 shadow-rose-500/20',
    },
    {
      year: '2024',
      title: 'LangGraph & Multi-Agent',
      desc: 'Stateful workflow graphs, cyclical agent loops, and multi-model routing.',
      iconColor: 'bg-amber-500 shadow-amber-500/20',
    },
    {
      year: '2024+',
      title: 'AI Engineering Journey Continues',
      desc: 'Deploying autonomous reasoning agents, advanced prompt engineering, and LLM Ops.',
      iconColor: 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-primary-500/25',
    },
  ]

  return (
    <section className="py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden bg-grid-glow">
      {/* Decorative gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Block */}
        <div className="text-center mb-20 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            📍 Timeline
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            My Coding Journey
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From coding fundamentals to constructing complex, stateful autonomous AI agent architectures.
          </p>
        </div>

        {/* Horizontal Timeline - Desktop (Scrollable) */}
        <div className="hidden lg:block overflow-x-auto pb-12 pt-6 custom-scrollbar scrollbar-thin">
          <div className="flex gap-6 min-w-[1400px] relative px-4">
            {/* Horizontal Line connecting nodes */}
            <div className="absolute top-[31px] left-8 right-8 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-accent-600 rounded-full opacity-20" />

            {milestones.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="w-[280px] flex-shrink-0 relative group"
              >
                {/* Node indicator */}
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${item.iconColor} shadow-lg font-black text-xs group-hover:scale-115 transition-transform duration-300`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-primary-600 dark:text-cyan-400 tracking-wider">
                      {item.year}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>

                {/* Milestone Detail Card */}
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-md group-hover:shadow-xl transition-all duration-300 min-h-[110px]">
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Connection chevron on the right (except last one) */}
                {idx < milestones.length - 1 && (
                  <div className="absolute top-7 -right-1.5 text-slate-300 dark:text-slate-850 pointer-events-none group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Vertical Timeline - Mobile */}
        <div className="lg:hidden relative space-y-12 pl-6 border-l-2 border-slate-200 dark:border-slate-800 max-w-lg mx-auto">
          {milestones.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              className="relative group"
            >
              {/* Bullet indicator */}
              <div className={`absolute -left-10 top-1.5 w-8 h-8 rounded-xl flex items-center justify-center text-white ${item.iconColor} shadow-md border-2 border-white dark:border-slate-950`}>
                <Bookmark className="w-3.5 h-3.5" />
              </div>

              {/* Year and Title */}
              <span className="text-xs font-black text-primary-600 dark:text-cyan-400 tracking-wider">
                {item.year}
              </span>
              <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight mb-2">
                {item.title}
              </h3>

              {/* Card Body */}
              <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-sm">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
