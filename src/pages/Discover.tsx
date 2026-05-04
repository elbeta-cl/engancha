import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, MapPin, X, Heart, Zap } from 'lucide-react'
import { SwipeCard } from '../components/SwipeCard'
import { MatchCelebration } from '../components/MatchCelebration'
import type { UserProfile, DiscoverMode } from '../types'
import icon from '../assets/icon.png'

const MODES_CATALOG = [
  { key: 'conocer', label: 'Solo conocer', emoji: '🗣️', color: '#3B82F6' },
  { key: 'bailar', label: 'Bailar', emoji: '💃', color: '#F59E0B' },
  { key: 'piquito', label: 'Piquito por cover', emoji: '💋', color: '#EC4899' },
  { key: 'diablo', label: 'Diablo', emoji: '😈', color: '#E8192C' },
  { key: 'trago', label: 'Tomar algo', emoji: '🍻', color: '#10B981' },
]

const MOCK_PROFILES: UserProfile[] = [
  {
    id: '1', name: 'Valentina', age: 23,
    photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80'],
    bio: 'Aquí para vivir la noche al máximo ✨',
    modes: [MODES_CATALOG[2], MODES_CATALOG[3]],
    sector: 'Terraza · VIP', isHere: true,
  },
  {
    id: '2', name: 'Camila', age: 25,
    photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80'],
    bio: 'Buena música, mejor compañía.',
    modes: [MODES_CATALOG[0], MODES_CATALOG[1]],
    sector: 'Pista principal',
  },
  {
    id: '3', name: 'Isabella', age: 22,
    photos: ['https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80'],
    modes: [MODES_CATALOG[4], MODES_CATALOG[3]],
    sector: 'Barra', isHere: true,
  },
  {
    id: '4', name: 'Sofía', age: 26,
    photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80'],
    bio: 'CEO de bailar hasta las 6am 💫',
    modes: [MODES_CATALOG[1]],
    sector: 'Pista principal',
  },
  {
    id: '5', name: 'Martina', age: 24,
    photos: ['https://images.unsplash.com/photo-1488716820095-cbe80883c496?w=400&q=80'],
    modes: [MODES_CATALOG[0], MODES_CATALOG[4]],
  },
]

export function Discover() {
  const [discoverMode, setDiscoverMode] = useState<DiscoverMode>('general')
  const [profiles, setProfiles] = useState(MOCK_PROFILES)
  const [showMatch, setShowMatch] = useState(false)
  const [matchProfile, setMatchProfile] = useState<UserProfile | null>(null)
  const [fastMode, setFastMode] = useState(false)

  const handleLike = useCallback(() => {
    const liked = profiles[profiles.length - 1]
    setProfiles((prev) => prev.slice(0, -1))
    if (Math.random() > 0.4) {
      setMatchProfile(liked)
      setShowMatch(true)
    }
  }, [profiles])

  const handleNope = useCallback(() => {
    setProfiles((prev) => prev.slice(0, -1))
  }, [])

  const currentProfile = profiles[profiles.length - 1]
  const nextProfile = profiles[profiles.length - 2]

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-safe-top pb-3 pt-4">
        <div className="flex items-center gap-2">
          <img src={icon} alt="Engancha" className="w-8 h-8" />
        </div>

        {/* Mode selector */}
        <div className="flex items-center gap-1 glass rounded-2xl p-1">
          <button
            onClick={() => setDiscoverMode('general')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              discoverMode === 'general'
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
            style={discoverMode === 'general' ? { background: 'linear-gradient(135deg, #E8192C, #E91E8C)' } : {}}
          >
            <Globe size={12} />
            General
          </button>
          <button
            onClick={() => setDiscoverMode('venue')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              discoverMode === 'venue'
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
            style={discoverMode === 'venue' ? { background: 'linear-gradient(135deg, #E8192C, #E91E8C)' } : {}}
          >
            <MapPin size={12} />
            En local
          </button>
        </div>

        {/* Fast mode toggle */}
        <button
          onClick={() => setFastMode(!fastMode)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
            fastMode ? 'text-white' : 'text-white/40'
          }`}
          style={fastMode ? { background: 'linear-gradient(135deg, #E8192C, #7B2FBE)' } : { background: 'rgba(255,255,255,0.05)' }}
          aria-label="Rondas rápidas"
        >
          <Zap size={12} />
          Rápido
        </button>
      </header>

      {/* Card stack */}
      <div className="flex-1 relative mx-4 my-2" style={{ minHeight: 0 }}>
        {profiles.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
          >
            <div className="text-5xl mb-4">🌙</div>
            <h3 className="text-white text-xl font-bold mb-2">Por ahora es todo</h3>
            <p className="text-white/40 text-sm">Vuelve más tarde para ver nuevos perfiles</p>
            <button
              onClick={() => setProfiles(MOCK_PROFILES)}
              className="btn-brand mt-6 px-6 py-3"
            >
              Recargar perfiles
            </button>
          </motion.div>
        ) : (
          <div className="absolute inset-0">
            {/* Background card (next) */}
            {nextProfile && (
              <div className="absolute inset-0 scale-[0.94] translate-y-4 rounded-3xl overflow-hidden"
                style={{ background: '#1a1a1a', zIndex: 1 }}>
                <img
                  src={nextProfile.photos[0]}
                  alt=""
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            )}
            {/* Top card */}
            <div className="absolute inset-0" style={{ zIndex: 2 }}>
              <AnimatePresence mode="wait">
                {currentProfile && (
                  <SwipeCard
                    key={currentProfile.id}
                    profile={currentProfile}
                    onLike={handleLike}
                    onNope={handleNope}
                    isTop
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {profiles.length > 0 && (
        <div className="flex items-center justify-center gap-6 px-4 py-4 mb-20">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleNope}
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border border-white/15 bg-white/5 hover:bg-red-500/10 transition-all"
            aria-label="Descartar"
          >
            <X size={24} className="text-white/60" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleLike}
            className="w-20 h-20 rounded-full flex items-center justify-center cursor-pointer glow-red transition-all"
            style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
            aria-label="Enganchar"
          >
            <div className="flex flex-col items-center">
              <Heart size={24} className="text-white" fill="white" />
              <span className="text-white text-[9px] font-bold mt-0.5">ENGANCHA</span>
            </div>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => {}}
            className="w-14 h-14 rounded-full flex items-center justify-center cursor-pointer border border-white/15 bg-white/5 transition-all"
            aria-label="Guardar"
          >
            <span className="text-xl">⭐</span>
          </motion.button>
        </div>
      )}

      {/* Fast mode overlay */}
      <AnimatePresence>
        {fastMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 pointer-events-none"
          >
            <div className="absolute top-20 left-0 right-0 flex justify-center">
              <div className="glass-strong rounded-2xl px-6 py-3 flex items-center gap-3">
                <Zap size={16} className="text-brand-red" />
                <span className="text-white font-bold">30s — Rondas rápidas</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match celebration */}
      <AnimatePresence>
        {showMatch && matchProfile && (
          <MatchCelebration
            matchId={matchProfile.id}
            userPhoto="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
            matchPhoto={matchProfile.photos[0]}
            matchName={matchProfile.name}
            onClose={() => setShowMatch(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
