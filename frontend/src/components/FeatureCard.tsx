import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  status: 'active' | 'upcoming'
  gradient: string
}

export default function FeatureCard({ icon: Icon, title, description, status, gradient }: FeatureCardProps) {
  // Card tilt effect coordinates
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    // Limit rotation to max 8 degrees
    const rotateX = -y / (rect.height / 16)
    const rotateY = x / (rect.width / 16)
    setTilt({ x: rotateY, y: rotateX })
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transformStyle: 'preserve-3d',
      }}
      className="group relative p-6 rounded-2xl glassmorphism-card hover-glow transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer select-none overflow-hidden"
    >
      {/* Background Glow Ring */}
      <div 
        className={`absolute -right-16 -top-16 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-500`} 
      />

      {/* Top Card Structure */}
      <div className="flex items-start justify-between gap-4 mb-4" style={{ transform: 'translateZ(20px)' }}>
        {/* Floating icon */}
        <div className={`p-3 bg-gradient-to-br ${gradient} rounded-xl text-white shadow-lg shadow-sky-500/10 group-hover:shadow-sky-500/25 transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="w-5.5 h-5.5" />
        </div>

        {/* Status Badge */}
        <span 
          className={`text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
            status === 'active'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
          }`}
        >
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-base font-extrabold text-slate-950 dark:text-white mb-2 tracking-tight group-hover:text-primary-600 dark:group-hover:text-cyan-400 transition-colors" style={{ transform: 'translateZ(10px)' }}>
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed group-hover:text-slate-700 dark:group-hover:text-slate-350 transition-colors">
        {description}
      </p>

      {/* Interactive indicator bar */}
      <div className="mt-4 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
    </motion.div>
  )
}
