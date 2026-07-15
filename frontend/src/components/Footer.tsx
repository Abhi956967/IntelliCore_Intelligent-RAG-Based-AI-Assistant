import { Github, Linkedin, Mail, Phone } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  const quickLinks = [
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Features', href: '#features' },
    { label: 'Technology Stack', href: '#technology' },
  ]

  return (
    <footer className="bg-gradient-to-b from-slate-900 via-slate-900 to-black text-slate-300 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Abhishek Maurya</h3>
            <p className="text-sm leading-relaxed text-slate-400">
              Machine Learning Engineer and Freelance AI Developer building RAG products, multi-agent systems, ML pipelines, and FastAPI services.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Connect</h3>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Abhi956967"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 hover:bg-primary-600 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5 text-white" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800 hover:bg-primary-600 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
              <a
                href="mailto:am6007965@gmail.com"
                className="p-3 bg-slate-800 hover:bg-primary-600 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-white" />
              </a>
              <a
                href="tel:+919569671914"
                className="p-3 bg-slate-800 hover:bg-primary-600 rounded-lg transition-all transform hover:scale-110 flex items-center justify-center"
                aria-label="Phone"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-8"></div>

        {/* Copyright */}
        <div className="text-center space-y-3">
          <p className="text-sm text-slate-500">
            &copy; {year} Abhishek Maurya. Built with IntelliCore.
          </p>
        </div>
      </div>
    </footer>
  )
}
