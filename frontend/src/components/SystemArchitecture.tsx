import { motion } from 'framer-motion'
import { User, Layout, Terminal, Cpu, Database, MessageSquare, Workflow } from 'lucide-react'

export default function SystemArchitecture() {
  const steps = [
    { id: 'user', name: 'User Query', icon: User, desc: 'Input prompt or PDF upload', color: 'text-blue-500 border-blue-500/30' },
    { id: 'frontend', name: 'React Frontend', icon: Layout, desc: 'Tailwind + Vite UI layers', color: 'text-purple-500 border-purple-500/30' },
    { id: 'fastapi', name: 'FastAPI Server', icon: Terminal, desc: 'Endpoint routing & streaming', color: 'text-emerald-500 border-emerald-500/30' },
    { id: 'llm_manager', name: 'LLM Routing', icon: Cpu, desc: 'Orchestrates multi-model fallbacks', color: 'text-indigo-500 border-indigo-500/30' },
    { id: 'langgraph', name: 'LangGraph State', icon: Workflow, desc: 'Agent loop & workflow execution', color: 'text-pink-500 border-pink-500/30' },
    { id: 'vectordb', name: 'Chroma Database', icon: Database, desc: 'Retrieves dense PDF embeddings', color: 'text-cyan-500 border-cyan-500/30' },
    { id: 'response', name: 'SSE Response', icon: MessageSquare, desc: 'Streaming tokens back to user', color: 'text-amber-500 border-amber-500/30' }
  ]

  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-primary-500/5 rounded-full blur-[140px] pointer-events-none" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        .flowing-line {
          stroke-dasharray: 6, 6;
          animation: dash 1s linear infinite;
        }
      `}} />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            📊 System Architecture
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Intelligent Agent Workflow
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Data pipeline mapping the lifecycle of user prompts, agent routing, fallback checks, and RAG document grounding.
          </p>
        </div>

        {/* Desktop Pipeline Layout */}
        <div className="hidden xl:block relative py-12 px-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl shadow-xl">
          {/* Connecting SVG Flow Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '300px' }}>
            {/* User -> Frontend */}
            <path d="M 120 150 L 220 150" fill="none" stroke="#3b82f6" strokeWidth="2" className="flowing-line opacity-60" />
            {/* Frontend -> FastAPI */}
            <path d="M 330 150 L 430 150" fill="none" stroke="#a855f7" strokeWidth="2" className="flowing-line opacity-60" />
            {/* FastAPI -> LLM Manager */}
            <path d="M 540 150 L 640 150" fill="none" stroke="#10b981" strokeWidth="2" className="flowing-line opacity-60" />
            
            {/* LLM Manager splits to providers */}
            {/* LLM Manager -> Groq */}
            <path d="M 740 150 Q 800 90 850 90" fill="none" stroke="#6366f1" strokeWidth="2" className="flowing-line opacity-40" />
            {/* LLM Manager -> Gemini */}
            <path d="M 740 150 Q 800 210 850 210" fill="none" stroke="#6366f1" strokeWidth="2" className="flowing-line opacity-40" />

            {/* Providers merge into LangGraph */}
            {/* Groq -> LangGraph */}
            <path d="M 940 90 Q 990 90 1050 150" fill="none" stroke="#ec4899" strokeWidth="2" className="flowing-line opacity-40" />
            {/* Gemini -> LangGraph */}
            <path d="M 940 210 Q 990 210 1050 150" fill="none" stroke="#ec4899" strokeWidth="2" className="flowing-line opacity-40" />

            {/* LangGraph loops with VectorDB */}
            <path d="M 1100 190 Q 1100 280 970 280 L 750 280 Q 640 280 640 370 L 640 380" fill="none" stroke="#0ea5e9" strokeWidth="2" className="flowing-line opacity-60" />
            {/* VectorDB back to LangGraph */}
            <path d="M 750 410 L 970 410 Q 1160 410 1160 280 Q 1160 150 1150 150" fill="none" stroke="#0ea5e9" strokeWidth="2" className="flowing-line opacity-60" />

            {/* LangGraph -> Response */}
            <path d="M 1150 150 L 1260 150" fill="none" stroke="#f59e0b" strokeWidth="2" className="flowing-line opacity-60" />
          </svg>

          {/* Grid Layout of Nodes */}
          <div className="relative z-10 grid grid-cols-7 gap-4 items-center min-h-[300px]">
            {/* Node 1: User */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/50 dark:border-blue-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <User className="w-8 h-8 text-blue-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">User</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-2 max-w-[100px]">Prompt / PDF Upload</p>
            </div>

            {/* Node 2: Frontend */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 dark:border-purple-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <Layout className="w-8 h-8 text-purple-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Frontend</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-2 max-w-[100px]">React UI Layers</p>
            </div>

            {/* Node 3: FastAPI */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <Terminal className="w-8 h-8 text-emerald-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">FastAPI</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-2 max-w-[100px]">SSE Streaming</p>
            </div>

            {/* Node 4: LLM Manager */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <Cpu className="w-8 h-8 text-indigo-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Router</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-2 max-w-[100px]">Fallback Logic</p>
            </div>

            {/* Node 5: Model Selection (Split) */}
            <div className="flex flex-col gap-6 justify-center">
              {/* Groq Node */}
              <div className="w-24 h-16 rounded-xl bg-orange-500/10 border border-orange-500/20 flex flex-col items-center justify-center p-2 text-center shadow shadow-orange-500/5">
                <span className="text-[11px] font-extrabold text-orange-600 dark:text-orange-400">Groq API</span>
                <span className="text-[8px] text-slate-450 dark:text-slate-500 font-bold uppercase">Llama-3</span>
              </div>
              {/* Gemini Node */}
              <div className="w-24 h-16 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-col items-center justify-center p-2 text-center shadow shadow-blue-500/5">
                <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400">Gemini</span>
                <span className="text-[8px] text-slate-450 dark:text-slate-500 font-bold uppercase">Pro Multimodal</span>
              </div>
            </div>

            {/* Node 6: LangGraph & VectorDB combined vertical column */}
            <div className="flex flex-col gap-8 justify-center items-center">
              {/* LangGraph Agent */}
              <div className="w-24 h-24 rounded-2xl bg-pink-50 dark:bg-pink-950/40 border border-pink-200/50 dark:border-pink-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <Workflow className="w-8 h-8 text-pink-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">LangGraph</span>
              </div>

              {/* Vector DB */}
              <div className="w-24 h-16 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex flex-col items-center justify-center p-2 text-center shadow shadow-cyan-500/5">
                <Database className="w-5 h-5 text-cyan-400 mb-0.5" />
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider">ChromaDB</span>
              </div>
            </div>

            {/* Node 7: Response */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/50 dark:border-amber-900/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
                <MessageSquare className="w-8 h-8 text-amber-500 mb-1" />
                <span className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Response</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center mt-2 max-w-[100px]">Streamed Answer</p>
            </div>
          </div>
        </div>

        {/* Mobile Architecture (Vertical List) */}
        <div className="xl:hidden space-y-6 max-w-md mx-auto">
          {steps.map((step, idx) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl shadow-md"
              >
                <div className={`p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border ${step.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-950 dark:text-white uppercase tracking-wider">{step.name}</h3>
                  <p className="text-xs text-slate-550 dark:text-slate-400">{step.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
