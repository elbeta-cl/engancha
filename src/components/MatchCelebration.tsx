import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

interface Props {
  matchId: string
  userPhoto: string
  matchPhoto: string
  matchName: string
  onClose: () => void
}

interface Particle {
  id: number
  x: number
  color: string
  size: number
  duration: number
  delay: number
}

export function MatchCelebration({ matchId, userPhoto, matchPhoto, matchName, onClose }: Props) {
  const navigate = useNavigate()
  const [particles, setParticles] = useState<Particle[]>([])
  const colors = ['#E8192C', '#E91E8C', '#7B2FBE', '#FF6B35', '#FFD700']

  useEffect(() => {
    const ps: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 8,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 0.5,
    }))
    setParticles(ps)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, rgba(232,25,44,0.3) 0%, #0A0A0A 70%)' }}
    >
      {/* Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute"
          style={{
            left: `${p.x}%`,
            bottom: '0',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: '50%',
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Glow rings */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute w-64 h-64 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(232,25,44,0.4) 0%, transparent 70%)' }}
      />

      {/* Photos */}
      <motion.div
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
        className="flex items-center gap-4 mb-8 z-10"
      >
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl overflow-hidden glow-red border-2 border-brand-red">
            <img src={userPhoto} alt="Tu foto" className="w-full h-full object-cover" />
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
          className="text-3xl z-10"
        >
          🔥
        </motion.div>
        <div className="relative">
          <div className="w-28 h-28 rounded-2xl overflow-hidden glow-red border-2 border-brand-pink">
            <img src={matchPhoto} alt={matchName} className="w-full h-full object-cover" />
          </div>
        </div>
      </motion.div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center z-10 px-6"
      >
        <h1 className="font-display text-5xl font-black mb-2 glow-text" style={{ color: '#fff' }}>
          Enganchaste 🔥
        </h1>
        <p className="text-white/70 text-lg">
          Tú y <span className="text-white font-semibold">{matchName}</span> se gustaron mutuamente
        </p>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-10 flex flex-col gap-3 w-full px-8 max-w-sm z-10"
      >
        <button
          onClick={() => { navigate(`/app/chat/${matchId}`); onClose() }}
          className="btn-brand py-4 text-base rounded-2xl"
        >
          Escribir ahora 💬
        </button>
        <button
          onClick={onClose}
          className="py-4 text-white/50 text-sm cursor-pointer hover:text-white transition-colors"
        >
          Seguir descubriendo
        </button>
      </motion.div>
    </motion.div>
  )
}
