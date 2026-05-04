import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Globe, MapPin, Zap, Radar } from 'lucide-react'
import logo from '../assets/logo.png'

export function AppHome() {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-6 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-sm">Buenas noches</p>
          <h1 className="font-display text-2xl font-black text-white mt-0.5">¿Qué buscas hoy?</h1>
        </div>
        <img src={logo} alt="Engancha" className="w-12 h-auto" />
      </div>

      <div className="px-4 space-y-4 flex-1">
        {/* Main modes */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/discover')}
            className="relative overflow-hidden rounded-3xl p-5 text-left cursor-pointer"
            style={{ background: 'linear-gradient(145deg, rgba(232,25,44,0.25), rgba(233,30,140,0.15))', border: '1px solid rgba(232,25,44,0.3)' }}
          >
            <Globe size={24} className="text-brand-red mb-3" />
            <h3 className="text-white font-bold text-base leading-tight">Enganchar General</h3>
            <p className="text-white/50 text-xs mt-1">Todos los perfiles activos</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
              style={{ background: '#E8192C' }} />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/discover')}
            className="relative overflow-hidden rounded-3xl p-5 text-left cursor-pointer"
            style={{ background: 'linear-gradient(145deg, rgba(123,47,190,0.25), rgba(233,30,140,0.15))', border: '1px solid rgba(123,47,190,0.3)' }}
          >
            <MapPin size={24} className="text-purple-400 mb-3" />
            <h3 className="text-white font-bold text-base leading-tight">En el local</h3>
            <p className="text-white/50 text-xs mt-1">Solo gente cerca de ti</p>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full opacity-10"
              style={{ background: '#7B2FBE' }} />
          </motion.button>
        </div>

        {/* Quick access */}
        <div className="grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/radar')}
            className="card-dark p-4 rounded-2xl text-left cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(232,25,44,0.1)' }}>
                <Radar size={16} className="text-brand-red" />
              </div>
              <span className="text-white font-medium text-sm">Radar</span>
            </div>
            <p className="text-white/40 text-xs">167 activos cerca</p>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/app/discover')}
            className="card-dark p-4 rounded-2xl text-left cursor-pointer hover:bg-white/5 transition-all"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(232,25,44,0.1)' }}>
                <Zap size={16} className="text-brand-pink" />
              </div>
              <span className="text-white font-medium text-sm">Rondas rápidas</span>
            </div>
            <p className="text-white/40 text-xs">5 perfiles en 30s</p>
          </motion.button>
        </div>

        {/* Activity feed */}
        <div>
          <h2 className="text-white/60 text-xs font-medium uppercase tracking-widest mb-3 px-1">Actividad reciente</h2>
          <div className="space-y-2">
            {[
              { type: 'like', name: 'Valentina', time: 'hace 2 min', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=80&q=80' },
              { type: 'match', name: 'Camila', time: 'hace 8 min', photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=80&q=80' },
              { type: 'like', name: 'Sofía', time: 'hace 15 min', photo: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=80&q=80' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card-dark flex items-center gap-3 p-3 rounded-2xl"
              >
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">
                    <span className="text-brand-pink">{item.name}</span>
                    {item.type === 'like' ? ' te dio like' : ' — ¡Match! 🔥'}
                  </p>
                  <p className="text-white/30 text-xs">{item.time}</p>
                </div>
                {item.type === 'match' && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
