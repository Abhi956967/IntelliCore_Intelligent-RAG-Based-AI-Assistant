import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

interface Testimonial {
  text: string
  author: string
  role: string
  stars: number
  avatar: string
}

export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      text: "Abhishek is an exceptional AI engineer with deep knowledge of LLMs, RAG pipelines, and high-performance backend systems. His agentic routing design is highly efficient!",
      author: "AI Mentor",
      role: "Senior ML Architect",
      stars: 5,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=AM&backgroundColor=0ea5e9"
    },
    {
      text: "Abhishek did an outstanding job designing and containerizing our custom document analysis app. He connected complex frontend states with async FastAPI streams flawlessly.",
      author: "Technical Client",
      role: "Founding Engineer, FinTech Startup",
      stars: 5,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TC&backgroundColor=8b5cf6"
    },
    {
      text: "The multi-agent web search orchestration Abhishek developed utilizing LangGraph improved our research gathering operations tenfold. Clean code and detailed documentation.",
      author: "Product Lead",
      role: "Engineering Director, GenAI Labs",
      stars: 5,
      avatar: "https://api.dicebear.com/7.x/initials/svg?seed=PL&backgroundColor=10b981"
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0) // -1 for left, 1 for right

  // Autoplay loop
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentIndex])

  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  // Animation variants
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0
    })
  }

  return (
    <section className="py-24 px-4 bg-slate-50 dark:bg-slate-950/40 relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            💬 Testimonials
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-950 dark:text-white tracking-tight">
            What People Say
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative min-h-[300px] flex items-center justify-center">
          {/* Quote Icon Background */}
          <div className="absolute top-4 left-6 text-slate-200/50 dark:text-slate-800/20 pointer-events-none select-none">
            <Quote className="w-24 h-24 stroke-[1]" />
          </div>

          <div className="w-full relative overflow-hidden px-4 py-8">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="p-8 md:p-10 rounded-3xl glassmorphism-card border border-slate-200/60 dark:border-slate-800/40 shadow-xl flex flex-col justify-between items-center text-center space-y-6"
              >
                {/* Rating stars */}
                <div className="flex gap-1 justify-center">
                  {[...Array(testimonials[currentIndex].stars)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Text quote */}
                <p className="text-base sm:text-lg text-slate-700 dark:text-slate-250 italic font-medium leading-relaxed max-w-2xl">
                  "{testimonials[currentIndex].text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-3.5 pt-2">
                  <img
                    src={testimonials[currentIndex].avatar}
                    alt={testimonials[currentIndex].author}
                    className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-900 shadow"
                  />
                  <div className="text-left">
                    <p className="text-sm font-extrabold text-slate-950 dark:text-white tracking-tight leading-tight">
                      {testimonials[currentIndex].author}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-cyan-500 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-cyan-400 rounded-2xl transition-all shadow-md active:scale-90 z-20"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary-500 dark:hover:border-cyan-500 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-cyan-400 rounded-2xl transition-all shadow-md active:scale-90 z-20"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bullet Pagination Indicators */}
        <div className="flex justify-center gap-2 mt-4 select-none">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1)
                setCurrentIndex(idx)
              }}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === idx 
                  ? 'w-6 bg-primary-600 dark:bg-cyan-500' 
                  : 'w-2.5 bg-slate-300 dark:bg-slate-800 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
