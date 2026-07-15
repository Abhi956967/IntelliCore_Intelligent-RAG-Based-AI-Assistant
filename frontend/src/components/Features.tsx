import FeatureCard, { features } from './FeatureCard'

export default function Features() {
  return (
    <section id="features" className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Agent Capabilities</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A practical assistant surface for portfolio Q&A, document analysis, current information, and reusable AI workflows.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="animate-fadeIn" style={{ animationDelay: `${idx * 150}ms` }}>
              <FeatureCard {...feature} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
