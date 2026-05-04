import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Flame, MapPin, TrendingUp } from 'lucide-react'
import icon from '../assets/icon.png'

const MODES_STATS = [
  { key: 'bailar', label: 'Bailar', emoji: '💃', count: 47, color: '#F59E0B' },
  { key: 'conocer', label: 'Conocer', emoji: '🗣️', count: 38, color: '#3B82F6' },
  { key: 'diablo', label: 'Diablo', emoji: '😈', count: 29, color: '#E8192C' },
  { key: 'piquito', label: 'Piquito', emoji: '💋', count: 22, color: '#EC4899' },
  { key: 'trago', label: 'Trago', emoji: '🍻', count: 31, color: '#10B981' },
]

const VENUE_ACTIVITY = [
  { time: '22:00', value: 20 },
  { time: '23:00', value: 45 },
  { time: '00:00', value: 78 },
  { time: '01:00', value: 92 },
  { time: '02:00', value: 85 },
  { time: '03:00', value: 60 },
]

export function Radar() {
  const [activeCount, setActiveCount] = useState(167)
  const vibe: 'tranquilo' | 'activo' | 'llamas' = 'llamas'

  useEffect(() => {
    const id = setInterval(() => {
      setActiveCount((c) => c + Math.floor(Math.random() * 5) - 2)
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const vibeConfig = {
    tranquilo: { label: 'Tranquilo', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
    activo: { label: 'Activo', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    llamas: { label: 'En llamas 🔥', color: '#E8192C', bg: 'rgba(232,25,44,0.1)' },
  }
  const currentVibe = vibeConfig[vibe]

  return (
    <div className="min-h-dvh bg-brand-dark pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={icon} alt="" className="w-8 h-8" />
          <h1 className="font-display text-2xl font-black text-white">Radar</h1>
        </div>
        <div
          className="px-3 py-1.5 rounded-xl text-xs font-semibold"
          style={{ background: currentVibe.bg, color: currentVibe.color, border: `1px solid ${currentVibe.color}30` }}
        >
          {currentVibe.label}
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Active users big card */}
        <motion.div
          className="card-dark p-6 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: 'radial-gradient(circle at 80% 50%, #E8192C 0%, transparent 70%)' }}
          />
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/50 text-sm">Usuarios activos</p>
              <div className="flex items-end gap-2 mt-1">
                <motion.span
                  key={activeCount}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-display text-5xl font-black text-gradient"
                >
                  {activeCount}
                </motion.span>
                <span className="text-white/40 text-sm mb-2">personas aquí</span>
              </div>
            </div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, rgba(232,25,44,0.2), rgba(123,47,190,0.2))', border: '1px solid rgba(232,25,44,0.2)' }}
            >
              <Users size={24} className="text-brand-pink" />
            </div>
          </div>

          {/* Pulse rings */}
          <div className="relative h-16 flex items-center justify-center">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border"
                style={{ borderColor: 'rgba(232,25,44,0.2)' }}
                animate={{ width: [20, 120], height: [20, 120], opacity: [0.6, 0] }}
                transition={{ duration: 2, delay: i * 0.6, repeat: Infinity }}
              />
            ))}
            <div
              className="w-5 h-5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
            />
          </div>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-dark p-4"
          >
            <MapPin size={16} className="text-brand-pink mb-2" />
            <p className="text-white font-bold text-xl">Bellavista</p>
            <p className="text-white/40 text-xs">Local activo</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-dark p-4"
          >
            <TrendingUp size={16} className="text-brand-red mb-2" />
            <p className="text-white font-bold text-xl">+34%</p>
            <p className="text-white/40 text-xs">vs hora anterior</p>
          </motion.div>
        </div>

        {/* Modes distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-dark p-5"
        >
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Flame size={14} className="text-brand-red" />
            Modos activos
          </h3>
          <div className="space-y-3">
            {MODES_STATS.map((mode, i) => {
              const max = Math.max(...MODES_STATS.map((m) => m.count))
              const pct = (mode.count / max) * 100
              return (
                <div key={mode.key} className="flex items-center gap-3">
                  <span className="text-sm w-6 text-center">{mode.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60 text-xs">{mode.label}</span>
                      <span className="text-white/60 text-xs">{mode.count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: mode.color }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>

        {/* Activity chart (mini) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card-dark p-5"
        >
          <h3 className="text-white font-semibold text-sm mb-4">Actividad de la noche</h3>
          <div className="flex items-end gap-2 h-20">
            {VENUE_ACTIVITY.map((item, i) => (
              <div key={item.time} className="flex-1 flex flex-col items-center gap-1">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.6, ease: 'easeOut' }}
                  className="w-full rounded-t-lg min-h-1"
                  style={{
                    background: i === VENUE_ACTIVITY.length - 2
                      ? 'linear-gradient(180deg, #E8192C, #E91E8C)'
                      : 'rgba(255,255,255,0.1)',
                    maxHeight: '100%',
                  }}
                />
                <span className="text-white/20 text-[9px]">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
