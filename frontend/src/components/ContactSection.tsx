import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Linkedin, Github, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setStatus('error')
      setErrorMsg('Please fill in all required fields.')
      return
    }

    setStatus('loading')
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    }, 1800)
  }

  const contactInfo = [
    { label: 'Email', value: 'am6007965@gmail.com', href: 'mailto:am6007965@gmail.com', icon: Mail, color: 'text-blue-500' },
    { label: 'LinkedIn', value: 'linkedin.com/in/abhishek-maurya-3aa00223b', href: 'https://www.linkedin.com/in/abhishek-maurya-3aa00223b', icon: Linkedin, color: 'text-indigo-500' },
    { label: 'GitHub', value: 'github.com/Abhi956967', href: 'https://github.com/Abhi956967', icon: Github, color: 'text-slate-800 dark:text-white' },
    { label: 'WhatsApp', value: '+91 9569671914', href: 'https://wa.me/919569671914', icon: Phone, color: 'text-emerald-500' },
    { label: 'Location', value: 'Delhi, India', href: null, icon: MapPin, color: 'text-rose-500' }
  ]

  return (
    <section id="contact" className="py-24 px-4 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            ✉️ Reach Out
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            Let's Connect
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Have a project in mind or want to collaborate? Send a message and let's construct something amazing.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left Block: Info Card & Portrait */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 rounded-3xl glassmorphism-card border border-slate-200/60 dark:border-slate-800/60 shadow-xl space-y-6 relative overflow-hidden"
            >
              {/* Profile/Portrait mock image */}
              <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/60">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-0.5 shadow-md shadow-primary-500/15">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl select-none">
                    AM
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">Abhishek Maurya</h3>
                  <p className="text-[10px] text-primary-600 dark:text-cyan-400 font-extrabold uppercase tracking-wider">Machine Learning Engineer</p>
                </div>
              </div>

              {/* Contact info list */}
              <ul className="space-y-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon
                  const content = (
                    <div className="flex items-center gap-3.5 group cursor-pointer select-none">
                      <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 group-hover:scale-105 transition-transform ${info.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="text-left overflow-hidden">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide leading-tight">{info.label}</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5 group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors">
                          {info.value}
                        </p>
                      </div>
                    </div>
                  )

                  return (
                    <li key={info.label}>
                      {info.href ? (
                        <a href={info.href} target="_blank" rel="noopener noreferrer">
                          {content}
                        </a>
                      ) : (
                        content
                      )}
                    </li>
                  )
                })}
              </ul>
            </motion.div>
          </div>

          {/* Right Block: Interactive Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 shadow-xl"
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="Abhishek"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 focus:border-primary-500 dark:focus:border-cyan-500 rounded-xl outline-none transition-colors text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="abhishek@example.com"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 focus:border-primary-500 dark:focus:border-cyan-500 rounded-xl outline-none transition-colors text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    placeholder="Project Inquiry"
                    className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 focus:border-primary-500 dark:focus:border-cyan-500 rounded-xl outline-none transition-colors text-slate-800 dark:text-slate-200"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-450 dark:text-slate-400">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Describe your idea or request..."
                    rows={4}
                    className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-800 focus:border-primary-500 dark:focus:border-cyan-500 rounded-xl outline-none transition-colors text-slate-800 dark:text-slate-200 resize-none"
                    required
                  />
                </div>

                {/* Status messages */}
                <AnimatePresence mode="wait">
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs rounded-xl text-left"
                    >
                      {errorMsg}
                    </motion.div>
                  )}
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl text-left flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Thank you! Your message was sent successfully.</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full group px-6 py-3.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
