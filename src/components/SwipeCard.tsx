import { useState } from 'react'
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion'
import { Heart, X } from 'lucide-react'
import type { UserProfile } from '../types'

interface Props {
  profile: UserProfile
  onLike: () => void
  onNope: () => void
  isTop: boolean
}

export function SwipeCard({ profile, onLike, onNope, isTop }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0)
  const [expanded, setExpanded] = useState(false)

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const likeOpacity = useTransform(x, [20, 100], [0, 1])
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0])

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onLike()
    else if (info.offset.x < -100) onNope()
  }

  return (
    <>
      <motion.div
        drag={isTop ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x, rotate }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 cursor-grab active:cursor-grabbing no-select"
        whileTap={{ scale: 0.98 }}
      >
        {/* Card */}
        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl">
          {/* Photo */}
          <div className="absolute inset-0 bg-zinc-900">
            {profile.photos.length > 0 ? (
              <img
                src={profile.photos[photoIndex]}
                alt={profile.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-brand-gradient opacity-30" />
              </div>
            )}
          </div>

          {/* Photo nav */}
          {profile.photos.length > 1 && (
            <>
              <div className="absolute top-3 left-3 right-3 flex gap-1 z-10">
                {profile.photos.map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 flex-1 rounded-full transition-all"
                    style={{ background: i === photoIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </div>
              <button
                className="absolute left-0 top-10 bottom-1/3 w-1/3 z-10 cursor-pointer"
                onClick={() => setPhotoIndex(Math.max(0, photoIndex - 1))}
                aria-label="Foto anterior"
              />
              <button
                className="absolute right-0 top-10 bottom-1/3 w-1/3 z-10 cursor-pointer"
                onClick={() => setPhotoIndex(Math.min(profile.photos.length - 1, photoIndex + 1))}
                aria-label="Foto siguiente"
              />
            </>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* LIKE / NOPE stamps */}
          <motion.div
            style={{ opacity: likeOpacity }}
            className="absolute top-12 left-6 rotate-[-20deg] border-4 border-green-400 rounded-xl px-3 py-1 z-20"
          >
            <span className="text-green-400 font-black text-2xl tracking-widest">ENGANCHA</span>
          </motion.div>
          <motion.div
            style={{ opacity: nopeOpacity }}
            className="absolute top-12 right-6 rotate-[20deg] border-4 border-red-500 rounded-xl px-3 py-1 z-20"
          >
            <span className="text-red-500 font-black text-2xl tracking-widest">NOPE</span>
          </motion.div>

          {/* Info */}
          <button
            className="absolute bottom-0 left-0 right-0 p-5 text-left cursor-pointer"
            onClick={() => setExpanded(true)}
            aria-label="Ver perfil"
          >
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-white font-bold text-2xl leading-tight">
                  {profile.name}{profile.age ? `, ${profile.age}` : ''}
                </h2>
                {profile.sector && (
                  <p className="text-white/60 text-sm mt-0.5">{profile.sector}</p>
                )}
              </div>
              {profile.isHere && (
                <span className="pill-brand text-xs font-semibold px-3 py-1 rounded-full mb-1"
                  style={{ background: 'linear-gradient(135deg, rgba(232,25,44,0.3), rgba(123,47,190,0.3))', border: '1px solid rgba(232,25,44,0.4)', color: '#fff' }}>
                  AQUÍ
                </span>
              )}
            </div>

            {/* Modes */}
            {profile.modes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.modes.map((mode) => (
                  <span
                    key={mode.key}
                    className="pill text-xs"
                    style={{ borderColor: `${mode.color}40`, color: '#fff', background: `${mode.color}20` }}
                  >
                    {mode.emoji} {mode.label}
                  </span>
                ))}
              </div>
            )}
          </button>
        </div>
      </motion.div>

      {/* Expanded profile */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute inset-0 z-30 rounded-3xl overflow-hidden"
            style={{ background: '#141414' }}
          >
            <img
              src={profile.photos[0]}
              alt={profile.name}
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setExpanded(false)}
                className="w-10 h-10 glass-strong rounded-full flex items-center justify-center cursor-pointer"
                aria-label="Cerrar"
              >
                <X size={18} className="text-white" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto max-h-64">
              <h2 className="text-white font-bold text-2xl">
                {profile.name}{profile.age ? `, ${profile.age}` : ''}
              </h2>
              {profile.bio && <p className="text-white/60 text-sm mt-2 leading-relaxed">{profile.bio}</p>}
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.modes.map((mode) => (
                  <span
                    key={mode.key}
                    className="pill text-sm"
                    style={{ borderColor: `${mode.color}40`, color: '#fff', background: `${mode.color}20` }}
                  >
                    {mode.emoji} {mode.label}
                  </span>
                ))}
              </div>
            </div>
            {/* Action buttons */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
              <button
                onClick={() => { setExpanded(false); onNope() }}
                className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer bg-white/10 border border-white/20 hover:bg-red-500/20 transition-all active:scale-90"
                aria-label="Descartar"
              >
                <X size={28} className="text-red-400" />
              </button>
              <button
                onClick={() => { setExpanded(false); onLike() }}
                className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer glow-red transition-all active:scale-90"
                style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
                aria-label="Enganchar"
              >
                <Heart size={32} className="text-white" fill="white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
