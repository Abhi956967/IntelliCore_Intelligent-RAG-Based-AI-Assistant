import { ArrowRight, Bot, FileText, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react'

export default function Hero({ setShowChat }: { setShowChat: (show: boolean) => void }) {
  return (
    <section className="relative px-4 py-20 md:py-24 bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_42%,#eef6ff_100%)] overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-[1.02fr_0.98fr] gap-12 items-center">
        <div className="animate-slideUp">
          <div className="inline-flex items-center gap-2 bg-white text-primary-700 px-4 py-2 rounded-full mb-6 border border-slate-200 shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">Groq + LangGraph + RAG assistant</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-950 mb-6 leading-[1.05]">
            Abhishek Maurya's intelligent AI portfolio and document assistant
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
            A production-minded AI experience built around ML pipelines, agent workflows, RAG, FastAPI services, and real-time search.
          </p>

          <div className="flex flex-wrap gap-3 mb-9">
            {['Machine Learning Engineer', 'Freelance AI Developer', 'FastAPI + LangGraph', 'Delhi, India'].map((item) => (
              <span key={item} className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-semibold shadow-sm">
                {item}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={() => setShowChat(true)}
              className="px-8 py-4 bg-slate-950 hover:bg-primary-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-2xl shadow-lg flex items-center gap-2 justify-center transform hover:-translate-y-0.5"
            >
              <Zap className="w-5 h-5" />
              Launch AI Agent
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href="#portfolio"
              className="px-8 py-4 border border-slate-300 text-slate-800 hover:border-primary-500 hover:text-primary-700 bg-white rounded-lg font-semibold transition-all text-center"
            >
              View Portfolio
            </a>
          </div>
        </div>

        <div className="relative animate-float">
          <div className="bg-slate-950 text-white border border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-cyan-300" />
                <div>
                  <p className="font-bold">IntelliCore Agent</p>
                  <p className="text-xs text-slate-400">Document-aware reasoning</p>
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-emerald-500/15 text-emerald-300 rounded">Groq live</span>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-white/10 border border-white/10 rounded-lg p-4 animate-fadeIn">
                <p className="text-sm text-slate-300 mb-2">User</p>
                <p className="text-white">Tell me about Abhishek from this resume.</p>
              </div>
              <div className="bg-cyan-400/10 border border-cyan-300/20 rounded-lg p-4 animate-fadeIn delay-150">
                <p className="text-sm text-cyan-200 mb-2">Assistant</p>
                <p className="text-slate-100 text-sm leading-relaxed">
                  Abhishek Maurya is a Machine Learning Engineer and Freelance AI Developer building RAG apps, multi-agent systems, and FastAPI ML services.
                </p>
              </div>
              <div className="grid sm:grid-cols-3 gap-3 pt-2">
                {[
                  { icon: FileText, label: 'PDF RAG' },
                  { icon: Search, label: 'Web search' },
                  { icon: ShieldCheck, label: 'Memory' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-3 py-3 text-sm text-slate-200">
                      <Icon className="w-4 h-4 text-cyan-300" />
                      {item.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
