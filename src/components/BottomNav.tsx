import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, User, Heart } from 'lucide-react'
import enganchaIcon from '../assets/icon.png'

type TabIcon = 'engancha' | 'discover' | 'radar' | 'chats' | 'profile'

const tabs: { to: string; iconType: TabIcon; label: string; end?: boolean }[] = [
  { to: '/app',          iconType: 'engancha', label: 'Inicio',    end: true },
  { to: '/app/discover', iconType: 'discover', label: 'Descubrir' },
  { to: '/app/radar',    iconType: 'radar',    label: 'Radar' },
  { to: '/app/chats',    iconType: 'chats',    label: 'Chats' },
  { to: '/app/profile',  iconType: 'profile',  label: 'Perfil' },
]

function TabIcon({ type, isActive }: { type: TabIcon; isActive: boolean }) {
  const size = isActive ? 18 : 20
  const className = isActive ? 'text-white' : 'text-white/40'
  const strokeWidth = isActive ? 2.5 : 1.5

  if (type === 'engancha') {
    return (
      <img
        src={enganchaIcon}
        alt="Inicio"
        className="transition-all"
        style={{
          width: size + 2,
          height: size + 2,
          opacity: isActive ? 1 : 0.4,
          filter: isActive ? 'none' : 'grayscale(0.3)',
        }}
      />
    )
  }

  if (type === 'radar') {
    return (
      <img
        src={enganchaIcon}
        alt="Radar"
        className="transition-all"
        style={{
          width: size + 2,
          height: size + 2,
          opacity: isActive ? 1 : 0.4,
          filter: isActive ? 'none' : 'grayscale(0.3)',
        }}
      />
    )
  }

  if (type === 'discover') return <Heart size={size} className={className} strokeWidth={strokeWidth} />
  if (type === 'chats')    return <MessageCircle size={size} className={className} strokeWidth={strokeWidth} />
  if (type === 'profile')  return <User size={size} className={className} strokeWidth={strokeWidth} />

  return null
}

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 glass safe-bottom">
      <div className="flex items-center justify-around px-2 py-2 max-w-md mx-auto">
        {tabs.map(({ to, iconType, label, end }) => (
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
                  {isActive && iconType !== 'engancha' && iconType !== 'radar' ? (
                    <div className="p-1.5 rounded-xl" style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}>
                      <TabIcon type={iconType} isActive={isActive} />
                    </div>
                  ) : (
                    <TabIcon type={iconType} isActive={isActive} />
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
