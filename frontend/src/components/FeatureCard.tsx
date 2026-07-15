import { Sparkles, FileText, Zap, Clock } from 'lucide-react'

export default function FeatureCard({ icon: Icon, title, description }: {
  icon: React.ComponentType<any>
  title: string
  description: string
}) {
  return (
    <div className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-primary-400 hover:shadow-xl hover:shadow-primary-100 transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-100 to-accent-100 rounded-lg group-hover:from-primary-200 group-hover:to-accent-200 transition-all transform group-hover:scale-110">
          <Icon className="w-6 h-6 text-primary-600 group-hover:text-primary-700" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed group-hover:text-slate-700 transition-colors">{description}</p>
      <div className="mt-4 h-1 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
    </div>
  )
}

export const features = [
  {
    icon: Sparkles,
    title: 'ChatGPT-like UX',
    description: 'Streaming answers, quick prompts, copy actions, and a cleaner assistant flow'
  },
  {
    icon: FileText,
    title: 'Resume-aware RAG',
    description: 'Upload PDFs and ask grounded questions about experience, skills, and projects'
  },
  {
    icon: Zap,
    title: 'Tool-using Agent',
    description: 'Uses search, memory, document retrieval, and calculations when the task needs it'
  },
  {
    icon: Clock,
    title: 'Provider Flexible',
    description: 'Runs on Groq now and keeps Gemini support ready for later'
  }
]
