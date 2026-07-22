import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Terminal, Layout, Database, Cloud, Star } from 'lucide-react'

interface TechItem {
  name: string
  level: number // percentage
  experience: string
  tooltip: string
}

interface Category {
  title: string
  icon: any
  gradient: string
  bgGradient: string
  items: TechItem[]
}

export default function TechStack() {
  const [activeTooltip, setActiveTooltip] = useState<{ categoryIdx: number; itemIdx: number } | null>(null)

  const categories: Category[] = [
    {
      title: 'AI & LLM',
      icon: Cpu,
      gradient: 'from-cyan-500 via-sky-500 to-blue-500',
      bgGradient: 'from-cyan-950/20 to-blue-950/20',
      items: [
        { name: 'Groq Llama', level: 92, experience: 'Advanced', tooltip: 'High-speed inference orchestration & prompt optimizations.' },
        { name: 'Gemini', level: 90, experience: 'Advanced', tooltip: 'Multimodal processing, function calling, & API integrations.' },
        { name: 'OpenAI / Anthropic', level: 88, experience: 'Advanced', tooltip: 'GPT-4 / Claude-3 prompt design & tool orchestration.' },
        { name: 'LangChain', level: 90, experience: 'Advanced', tooltip: 'Chain building, document loaders, & expression language.' },
        { name: 'LangGraph', level: 95, experience: 'Expert', tooltip: 'Stateful multi-agent workflows, cycles, & memory systems.' },
        { name: 'Hugging Face', level: 80, experience: 'Intermediate', tooltip: 'Model hosting, tokenizers, & dataset pipelines.' },
      ]
    },
    {
      title: 'Backend',
      icon: Terminal,
      gradient: 'from-emerald-500 via-teal-500 to-green-500',
      bgGradient: 'from-emerald-950/20 to-green-950/20',
      items: [
        { name: 'FastAPI', level: 95, experience: 'Expert', tooltip: 'Asynchronous microservices, dependency injection, & SSE streaming.' },
        { name: 'Python', level: 95, experience: 'Expert', tooltip: 'Data structures, algorithms, scripts, & ML pipelines.' },
        { name: 'Uvicorn / Gunicorn', level: 85, experience: 'Advanced', tooltip: 'ASGI server configuration & production deployment.' },
        { name: 'SQLAlchemy / Prisma', level: 88, experience: 'Advanced', tooltip: 'ORM mapping, migrations, & performance indexing.' },
        { name: 'Pydantic', level: 92, experience: 'Advanced', tooltip: 'Data validation, settings management, & type safety.' },
      ]
    },
    {
      title: 'Frontend',
      icon: Layout,
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
      bgGradient: 'from-purple-950/20 to-pink-950/20',
      items: [
        { name: 'Next.js', level: 85, experience: 'Advanced', tooltip: 'App Router, Server Components, & SSR/ISR generation.' },
        { name: 'React', level: 90, experience: 'Advanced', tooltip: 'Hooks, context API, state management, & high perf rendering.' },
        { name: 'TypeScript', level: 90, experience: 'Advanced', tooltip: 'Interface designs, generics, & rigorous type checking.' },
        { name: 'Tailwind CSS', level: 92, experience: 'Advanced', tooltip: 'Utility-first layouts, responsive configs, & transitions.' },
        { name: 'Framer Motion', level: 88, experience: 'Advanced', tooltip: 'Complex spring physics, scroll triggers, & entrance states.' },
      ]
    },
    {
      title: 'Database',
      icon: Database,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500',
      bgGradient: 'from-blue-950/20 to-purple-950/20',
      items: [
        { name: 'ChromaDB', level: 90, experience: 'Advanced', tooltip: 'Vector index building, cosine distance filtering, & collection queries.' },
        { name: 'PostgreSQL', level: 88, experience: 'Advanced', tooltip: 'Relational schema design, transactions, & complex joins.' },
        { name: 'SQLite', level: 85, experience: 'Advanced', tooltip: 'Embedded SQL configurations & fast local testing.' },
        { name: 'Pinecone', level: 82, experience: 'Intermediate', tooltip: 'Serverless vector indexes, namespaces, & metadata filters.' },
        { name: 'FAISS', level: 80, experience: 'Intermediate', tooltip: 'Local indexing & similarity search algorithms.' },
      ]
    },
    {
      title: 'Cloud & DevOps',
      icon: Cloud,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgGradient: 'from-amber-950/20 to-red-950/20',
      items: [
        { name: 'AWS EC2 / S3', level: 85, experience: 'Advanced', tooltip: 'Virtual server management, secure S3 storage, & IAM roles.' },
        { name: 'Docker', level: 90, experience: 'Advanced', tooltip: 'Containerization, docker-compose, & multi-stage builds.' },
        { name: 'GitHub Actions', level: 88, experience: 'Advanced', tooltip: 'CI/CD pipeline automation, linting, & test runners.' },
        { name: 'Render / Vercel', level: 90, experience: 'Advanced', tooltip: 'Automated hosting & preview deployments.' },
      ]
    }
  ]

  return (
    <section id="technology" className="py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden bg-grid-glow">
      {/* Glow shapes */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            🛠️ Engineering Stack
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Modern Technology Stack
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Built with production-grade frameworks and libraries for performance, durability, and high scalability.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {categories.map((cat, catIdx) => {
            const Icon = cat.icon
            return (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: catIdx * 0.1 }}
                className="group relative p-5 rounded-2xl glassmorphism-card border border-slate-200/60 dark:border-slate-800/40 hover-glow transition-all duration-300 flex flex-col justify-between"
              >
                {/* Background ambient color */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none`} />

                <div className="relative z-10">
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800/60">
                    <div className={`p-2.5 bg-gradient-to-br ${cat.gradient} rounded-xl text-white shadow-md shadow-slate-200/50 dark:shadow-none`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-extrabold text-slate-950 dark:text-white text-base tracking-tight">
                      {cat.title}
                    </h3>
                  </div>

                  {/* Tech Items List */}
                  <ul className="space-y-4">
                    {cat.items.map((item, itemIdx) => (
                      <li 
                        key={item.name}
                        className="relative"
                        onMouseEnter={() => setActiveTooltip({ categoryIdx: catIdx, itemIdx })}
                        onMouseLeave={() => setActiveTooltip(null)}
                      >
                        <div className="flex justify-between items-center mb-1 text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-250 hover:text-primary-600 dark:hover:text-cyan-400 transition-colors cursor-pointer flex items-center gap-1">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500">
                            {item.experience}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden border border-slate-200/20 dark:border-slate-800">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: catIdx * 0.1 + itemIdx * 0.05 }}
                            className={`bg-gradient-to-r ${cat.gradient} h-full rounded-full`}
                          />
                        </div>

                        {/* Custom Tooltip */}
                        <AnimatePresence>
                          {activeTooltip?.categoryIdx === catIdx && activeTooltip?.itemIdx === itemIdx && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 5, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute left-0 right-0 bottom-full mb-2.5 p-3 bg-slate-950 dark:bg-slate-900 text-white rounded-xl border border-slate-800 shadow-2xl z-50 text-[11px] leading-relaxed"
                            >
                              <div className="flex items-center gap-1.5 mb-1 font-extrabold text-cyan-400 text-xs">
                                <Star className="w-3.5 h-3.5 fill-cyan-400" />
                                <span>{item.name}</span>
                              </div>
                              <p className="text-slate-350">{item.tooltip}</p>
                              {/* Arrow */}
                              <div className="absolute top-full left-4 -translate-y-1 w-2.5 h-2.5 bg-slate-950 dark:bg-slate-900 border-r border-b border-slate-800 rotate-45" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
