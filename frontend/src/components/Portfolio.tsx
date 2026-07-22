import { motion } from 'framer-motion'
import { Github, ExternalLink, Cpu, Sparkles, FileSearch, HelpCircle } from 'lucide-react'

interface Project {
  title: string
  description: string
  imageBg: string
  imageIcon: any
  techStack: string[]
  aiModels: string[]
  liveLink: string
  githubLink: string
  status: 'Active' | 'Deployed' | 'Live'
  tags: string[]
}

export default function Portfolio() {
  const projects: Project[] = [
    {
      title: 'IntelliCore AI Assistant',
      description: 'Advanced AI assistant with RAG, multi-LLM support, web search integration, and stateful agentic workflows.',
      imageBg: 'from-blue-600 to-indigo-900',
      imageIcon: Cpu,
      techStack: ['RAG', 'LangGraph', 'Multi-LLM', 'FastAPI', 'ChromaDB'],
      aiModels: ['Llama 3', 'Gemini Pro'],
      liveLink: '#',
      githubLink: 'https://github.com/Abhi956967/IntelliCore_Intelligent-RAG-Based-AI-Assistant',
      status: 'Active',
      tags: ['Production', 'Open Source']
    },
    {
      title: 'Resume Analyzer AI',
      description: 'AI-powered resume screening and analysis tool that extracts features, calculates score matching, and analyzes structures.',
      imageBg: 'from-purple-600 to-fuchsia-900',
      imageIcon: FileSearch,
      techStack: ['Python', 'NLP', 'FastAPI', 'Hugging Face', 'Sentence-Transformers'],
      aiModels: ['RoBERTa', 'Llama 2'],
      liveLink: '#',
      githubLink: 'https://github.com/Abhi956967',
      status: 'Deployed',
      tags: ['Tool', 'HR Tech']
    },
    {
      title: 'Document Chat AI',
      description: 'Chat with multiple PDF/TXT documents using vector store grounding, semantic searches, and context extraction.',
      imageBg: 'from-cyan-600 to-blue-900',
      imageIcon: Sparkles,
      techStack: ['React', 'FastAPI', 'ChromaDB', 'LangChain', 'OpenAI'],
      aiModels: ['GPT-4', 'text-embedding-ada'],
      liveLink: '#',
      githubLink: 'https://github.com/Abhi956967',
      status: 'Live',
      tags: ['Productivity', 'Finance']
    },
    {
      title: 'AI Research Assistant',
      description: 'Intelligent research assistant integrating search APIs, query expansions, multi-source summaries, and bibliography compiling.',
      imageBg: 'from-amber-600 to-orange-950',
      imageIcon: HelpCircle,
      techStack: ['Python', 'Tavily', 'Gemini API', 'Streamlit', 'Asyncio'],
      aiModels: ['Gemini Flash', 'Llama-3-70b'],
      liveLink: '#',
      githubLink: 'https://github.com/Abhi956967',
      status: 'Active',
      tags: ['Lab', 'Research']
    }
  ]

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring' as const, 
        stiffness: 70, 
        damping: 15 
      } 
    }
  }

  return (
    <section id="portfolio" className="py-24 px-4 bg-white dark:bg-slate-950 relative overflow-hidden">
      {/* Light glow background orbs */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-primary-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
              🚀 Featured Projects
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
              A few things I've built with passion
            </h2>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Explore my latest AI agent pipelines, machine learning models, and full-stack software products.
            </p>
          </div>
          <a
            href="https://github.com/Abhi956967"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-cyan-400 hover:text-primary-500 dark:hover:text-cyan-300 transition-colors border-b border-primary-500/20 dark:border-cyan-500/20 pb-1"
          >
            <span>View All Projects</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {projects.map((project) => {
            const ImageIcon = project.imageIcon
            return (
              <motion.article
                key={project.title}
                variants={cardVariants}
                className="group relative flex flex-col justify-between rounded-2xl glassmorphism-card border border-slate-200/50 dark:border-slate-800/40 overflow-hidden hover:shadow-2xl hover:shadow-primary-500/5 dark:hover:shadow-black/40 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Abstract Visual Header */}
                <div className={`relative h-44 bg-gradient-to-br ${project.imageBg} flex items-center justify-center p-6 overflow-hidden`}>
                  {/* Decorative mesh rings */}
                  <div className="absolute inset-0 bg-grid-glow opacity-20" />
                  <div className="absolute -inset-10 bg-radial-gradient(circle, rgba(255,255,255,0.1)_0%, transparent_70%) animate-pulse-glow" />
                  
                  {/* Floating abstract SVGs */}
                  <div className="absolute w-[200px] h-[200px] rounded-full border border-white/5 animate-spin [animation-duration:30s]" />
                  <div className="absolute w-[140px] h-[140px] rounded-full border border-dashed border-white/10 animate-spin [animation-duration:20s]" />

                  {/* Icon */}
                  <ImageIcon className="w-12 h-12 text-white relative z-10 drop-shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500" />

                  {/* Status Badge */}
                  <span className="absolute top-4 right-4 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white">
                    {project.status}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {project.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-bold px-2 py-0.5 rounded bg-primary-500/10 dark:bg-cyan-500/10 text-primary-600 dark:text-cyan-400 border border-primary-500/5 dark:border-cyan-500/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  {/* Details Block */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                    {/* Tech Stack Tags */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Tech Stack
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.map(tech => (
                          <span key={tech} className="text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* AI Models utilized */}
                    <div className="space-y-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        AI Models
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.aiModels.map(model => (
                          <span key={model} className="text-[10px] font-bold text-slate-800 dark:text-slate-200 bg-slate-200/50 dark:bg-slate-800 px-2 py-0.5 rounded">
                            🤖 {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Links */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a
                      href={project.liveLink}
                      className="inline-flex items-center justify-center gap-1.5 py-2 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-cyan-500 text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-cyan-400 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-900 dark:hover:bg-slate-100 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
