import { Code2, Database, Cpu, Zap, CheckCircle2 } from 'lucide-react'

export default function TechStack() {
  const techs = [
    {
      category: 'AI & LLM',
      icon: Cpu,
      color: 'from-slate-900 to-primary-600',
      bgColor: 'from-slate-50 to-blue-50',
      items: ['Groq Llama', 'Gemini-ready', 'LangGraph', 'LangChain']
    },
    {
      category: 'Backend',
      icon: Code2,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      items: ['FastAPI', 'Python', 'uvicorn', 'SSE Streaming']
    },
    {
      category: 'Data & Search',
      icon: Database,
      color: 'from-green-600 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      items: ['ChromaDB', 'SQLite', 'Tavily Search', 'Embeddings']
    },
    {
      category: 'Frontend',
      icon: Zap,
      color: 'from-orange-600 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      items: ['React', 'TypeScript', 'Tailwind CSS', 'Vite']
    }
  ]

  return (
    <section id="technology" className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Technology Stack</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Built with modern, production-ready technologies for performance, reliability, and document-grounded reasoning.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {techs.map((tech, idx) => {
            const Icon = tech.icon
            return (
              <div
                key={tech.category}
                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-primary-400 hover:shadow-xl hover:shadow-primary-100 transition-all duration-300 transform hover:-translate-y-1 animate-fadeIn"
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tech.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative p-6 z-10">
                  <div className={`flex items-center gap-3 mb-4`}>
                    <div className={`p-3 bg-gradient-to-br ${tech.color} rounded-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{tech.category}</h3>
                  </div>
                  <ul className="space-y-3">
                    {tech.items.map((item) => (
                      <li key={item} className="text-sm text-slate-600 group-hover:text-slate-700 flex items-start gap-2 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
