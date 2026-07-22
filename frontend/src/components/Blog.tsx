import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowUpRight, BookOpen } from 'lucide-react'

interface Post {
  title: string
  desc: string
  category: string
  readTime: string
  date: string
  gradient: string
}

export default function Blog() {
  const posts: Post[] = [
    {
      title: 'Build RAG Pipeline with LangChain & Groq',
      desc: 'Step-by-step implementation guide to building a robust document chunking, indexing, and vector similarity retrieval pipeline.',
      category: 'RAG Pipeline',
      readTime: '8 min read',
      date: 'May 20, 2024',
      gradient: 'from-blue-600 to-cyan-500'
    },
    {
      title: 'Multi-LLM Fallback Strategy Explained',
      desc: 'How to structure automated provider routing, checking api latency rates, and implementing fallback logic for production uptime.',
      category: 'Multi-LLM',
      readTime: '6 min read',
      date: 'May 10, 2024',
      gradient: 'from-violet-600 to-fuchsia-500'
    },
    {
      title: 'LangGraph: Build Stateful AI Agents',
      desc: 'Explore cycles, state persistence, conversational memory configurations, and dynamic routing using the stateful agent graph.',
      category: 'AI Agents',
      readTime: '10 min read',
      date: 'Apr 25, 2024',
      gradient: 'from-amber-600 to-orange-500'
    }
  ]

  return (
    <section id="blog" className="py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden bg-grid-glow">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
              ✍️ Publications
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              Latest Blog Posts
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Sharing technical workflows, system architectural notes, and tutorials on LLMs and agentic networks.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-cyan-400 hover:text-primary-500 dark:hover:text-cyan-300 transition-colors border-b border-primary-500/20 dark:border-cyan-500/20 pb-1"
          >
            <span>View All Posts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post, idx) => (
            <motion.article
              key={post.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group relative flex flex-col justify-between rounded-2xl glassmorphism-card border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:shadow-2xl hover:shadow-primary-500/5 transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Card visual banner header */}
              <div className={`h-40 bg-gradient-to-br ${post.gradient} p-6 relative flex items-center justify-center overflow-hidden`}>
                <div className="absolute inset-0 bg-grid-glow opacity-25" />
                <BookOpen className="w-10 h-10 text-white relative z-10 opacity-80 group-hover:scale-110 transition-transform duration-500" />
                
                {/* Category badge floating */}
                <span className="absolute top-4 left-4 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/45 backdrop-blur-md border border-white/10 text-white">
                  {post.category}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  {/* Meta items */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight leading-snug group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors">
                    {post.title}
                  </h3>

                  {/* Desc */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {post.desc}
                  </p>
                </div>

                {/* Read Button */}
                <div className="pt-2">
                  <a
                    href="#"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary-600 dark:text-cyan-400 hover:text-primary-500 dark:hover:text-cyan-300 transition-all group-hover:translate-x-1 duration-300"
                  >
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
