import {
  Award,
  Briefcase,
  ExternalLink,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Rocket,
  ShieldCheck,
  Workflow,
} from 'lucide-react'

const skills = [
  'Python',
  'SQL',
  'MongoDB',
  'LangChain',
  'LangGraph',
  'RAG',
  'Vector DBs',
  'Groq API',
  'FastAPI',
  'Docker',
  'AWS EC2',
  'MLflow',
  'Power BI',
  'Pandas',
  'TensorFlow',
  'XGBoost',
]

const projects = [
  {
    title: 'Network Security ML Pipeline',
    icon: ShieldCheck,
    meta: 'Python, Docker, FastAPI, AWS, MLflow',
    body: 'End-to-end phishing website detection pipeline with data ingestion, validation, feature engineering, model training, evaluation, CI/CD, and REST inference.',
    stat: '94% accuracy',
  },
  {
    title: 'Multi AI Agent Platform',
    icon: Workflow,
    meta: 'Groq, LangGraph, LangChain, FastAPI, Streamlit',
    body: 'Scalable multi-agent platform with Tavily search, memory, customizable system prompts, multi-model orchestration, and modular FastAPI services.',
    stat: 'Agentic workflows',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 items-start">
          <div className="lg:sticky lg:top-24 animate-slideUp">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-700 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-5">
              <Briefcase className="w-4 h-4" />
              Resume Portfolio
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 mb-5 leading-tight">
              Machine learning engineer focused on useful AI products.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Abhishek Maurya builds scalable ML pipelines, GenAI applications, AI agent workflows, and FastAPI services that connect business requirements with technical execution.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <a href="mailto:am6007965@gmail.com" className="flex items-center gap-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:text-primary-700">
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a href="tel:+919569671914" className="flex items-center gap-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:text-primary-700">
                <Phone className="w-4 h-4" />
                Call
              </a>
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700">
                <MapPin className="w-4 h-4" />
                Delhi, New Delhi
              </div>
              <a href="https://github.com/Abhi956967" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-slate-50 hover:bg-primary-50 border border-slate-200 rounded-lg px-4 py-3 text-sm font-semibold text-slate-700 hover:text-primary-700">
                <ExternalLink className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-5">
              {projects.map((project, idx) => {
                const Icon = project.icon
                return (
                  <article key={project.title} className="group border border-slate-200 bg-slate-50 hover:bg-white rounded-lg p-6 shadow-sm hover:shadow-xl transition-all duration-300 animate-fadeIn" style={{ animationDelay: `${idx * 120}ms` }}>
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="p-3 rounded-lg bg-slate-950 text-white group-hover:bg-primary-600 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">{project.stat}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 mb-2">{project.title}</h3>
                    <p className="text-sm font-semibold text-primary-700 mb-3">{project.meta}</p>
                    <p className="text-sm text-slate-600 leading-relaxed">{project.body}</p>
                  </article>
                )
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm animate-fadeIn">
                <div className="flex items-center gap-3 mb-4">
                  <Briefcase className="w-5 h-5 text-primary-600" />
                  <h3 className="text-xl font-bold text-slate-950">Experience</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="font-bold text-slate-900">Freelance AI Engineer</p>
                    <p className="text-sm text-slate-500">Independent Contractor, 2024 - Present</p>
                    <p className="text-sm text-slate-600 mt-2">Custom AI products, multi-agent systems, GenAI workflows, LangChain, and LangGraph automation.</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Business & Help Desk Analyst</p>
                    <p className="text-sm text-slate-500">Finnable Technologies, Nov 2024 - Aug 2025</p>
                    <p className="text-sm text-slate-600 mt-2">EDA, data cleaning, reporting dashboards, ticket categorization, and operational insights.</p>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-sm animate-fadeIn delay-150">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary-600" />
                  <h3 className="text-xl font-bold text-slate-950">Education</h3>
                </div>
                <p className="font-bold text-slate-900">Bachelor of Computer Applications</p>
                <p className="text-sm text-slate-500">Aryabhatta Knowledge University, Patna</p>
                <p className="text-sm text-slate-600 mt-2">CGPA 8.31/10, Sep 2021 - Sep 2024</p>
                <div className="flex items-center gap-2 mt-5 text-sm text-slate-600">
                  <Award className="w-4 h-4 text-amber-500" />
                  Data Science with Generative AI, Python with DSA, Cloud Computing, Power BI
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-6 bg-slate-950 text-white shadow-xl animate-fadeIn">
              <div className="flex items-center gap-3 mb-5">
                <Rocket className="w-5 h-5 text-cyan-300" />
                <h3 className="text-xl font-bold">Core Skills</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="px-3 py-2 bg-white/10 border border-white/10 rounded-lg text-sm text-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
