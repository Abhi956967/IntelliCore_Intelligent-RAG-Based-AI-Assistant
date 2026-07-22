import { motion } from 'framer-motion'
import { Cpu, Database, RefreshCw, Globe, Activity, Brain, Mic, Eye, Wrench } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function Features() {
  const capabilities = [
    {
      icon: Cpu,
      title: 'Multi-LLM Support',
      description: 'Run Groq Llama, Google Gemini, OpenAI, and Claude model routing seamlessly.',
      status: 'active' as const,
      gradient: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Database,
      title: 'RAG Pipeline',
      description: 'Document chunk parsing and vector search grounding with ChromaDB integration.',
      status: 'active' as const,
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: RefreshCw,
      title: 'Auto Fallback',
      description: 'Automatic provider routing failover systems to guarantee high uptime.',
      status: 'active' as const,
      gradient: 'from-violet-500 to-fuchsia-500',
    },
    {
      icon: Globe,
      title: 'Web Search',
      description: 'Real-time information retrieval powered by Tavily Web Search index.',
      status: 'active' as const,
      gradient: 'from-sky-500 to-cyan-500',
    },
    {
      icon: Activity,
      title: 'Streaming AI',
      description: 'Real-time streaming answers delivered instantly via Server-Sent Events (SSE).',
      status: 'active' as const,
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: Brain,
      title: 'Memory System',
      description: 'Short-term context window matching plus persistent session memory storage.',
      status: 'active' as const,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: Mic,
      title: 'Voice AI',
      description: 'Speech-to-text input and natural text-to-speech voice response integration.',
      status: 'upcoming' as const,
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: Eye,
      title: 'Vision AI',
      description: 'Multi-modal image analysis, OCR, and visual context understanding pipelines.',
      status: 'upcoming' as const,
      gradient: 'from-purple-500 to-indigo-500',
    },
    {
      icon: Wrench,
      title: 'Tool Calling',
      description: 'Semantic function binding, custom calculator tools, and external API execution.',
      status: 'active' as const,
      gradient: 'from-orange-500 to-amber-500',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  }

  return (
    <section id="features" className="py-24 px-4 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title Block */}
        <div className="text-center mb-16 space-y-4">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-500/10 text-primary-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider"
          >
            ⚡ Agent Capabilities
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight"
          >
            Powerful Features for Advanced AI
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Explore the features and tools that enable IntelliCore to provide intelligent RAG-grounded responses and automate complex agent loops.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {capabilities.map((cap, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <FeatureCard {...cap} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
