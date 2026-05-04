import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, MessageCircle, Radar, User } from 'lucide-react'

const tabs = [
  { to: '/app', icon: Flame, label: 'Inicio', end: true },
  { to: '/app/discover', icon: Flame, label: 'Descubrir' },
  { to: '/app/radar', icon: Radar, label: 'Radar' },
  { to: '/app/chats', icon: MessageCircle, label: 'Chats' },
  { to: '/app/profile', icon: User, label: 'Perfil' },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {tabs.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="flex flex-col items-center gap-0.5 min-w-[44px] min-h-[44px] justify-center cursor-pointer"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.15 : 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className="relative"
                >
                  {isActive ? (
                    <div className="p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}>
                      <Icon size={18} className="text-white" strokeWidth={2.5} />
                    </div>
                  ) : (
                    <Icon size={20} className="text-white/40" strokeWidth={1.5} />
                  )}
                </motion.div>
                <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-gradient' : 'text-white/30'}`}>
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
