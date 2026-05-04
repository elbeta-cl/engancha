import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Clock } from 'lucide-react'
import { getCountdown, formatTime } from '../lib/utils'
import type { Match } from '../types'

const MOCK_MATCHES: Match[] = [
  {
    id: '1',
    user: {
      id: '1', name: 'Valentina', age: 23,
      photos: ['https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&q=80'],
      modes: [],
    },
    matchedAt: new Date(Date.now() - 5 * 60000),
    deadline: new Date(Date.now() + 25 * 60000),
    isActive: true,
    lastMessage: 'Hola! te vi recién en la pista 👀',
    lastMessageTime: new Date(Date.now() - 2 * 60000),
    unread: 2,
  },
  {
    id: '2',
    user: {
      id: '2', name: 'Camila', age: 25,
      photos: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&q=80'],
      modes: [],
    },
    matchedAt: new Date(Date.now() - 35 * 60000),
    deadline: new Date(Date.now() - 5 * 60000),
    isActive: false,
    lastMessage: 'Wena estuvo buena la noche 🔥',
    lastMessageTime: new Date(Date.now() - 40 * 60000),
  },
  {
    id: '3',
    user: {
      id: '3', name: 'Sofía', age: 26,
      photos: ['https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80'],
      modes: [],
    },
    matchedAt: new Date(Date.now() - 3 * 60000),
    deadline: new Date(Date.now() + 27 * 60000),
    isActive: true,
    lastMessage: undefined,
    unread: 0,
  },
]

function CountdownBadge({ deadline, isActive }: { deadline: Date; isActive: boolean }) {
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!isActive) { setLabel('Congelado'); return }
    const update = () => setLabel(getCountdown(deadline))
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [deadline, isActive])

  if (!isActive) return (
    <span className="text-xs text-white/20 flex items-center gap-1">
      <Clock size={10} /> Congelado
    </span>
  )

  const diff = deadline.getTime() - Date.now()
  const isUrgent = diff < 5 * 60000

  return (
    <span className={`text-xs flex items-center gap-1 font-mono ${isUrgent ? 'text-brand-red' : 'text-white/40'}`}>
      <Clock size={10} /> {label}
    </span>
  )
}

export function Chats() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = MOCK_MATCHES.filter((m) =>
    m.user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col pb-20">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <h1 className="font-display text-2xl font-black text-white mb-4">Chats</h1>
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="search"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full glass rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-red/50 transition-colors"
          />
        </div>
      </div>

      {/* Match list */}
      <div className="flex-1 px-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">💬</div>
            <p className="text-white/40 text-sm">Aún no tenés matches</p>
            <p className="text-white/25 text-xs mt-1">¡Salí a enganchar!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((match, i) => (
              <motion.button
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => navigate(`/app/chat/${match.id}`)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer text-left ${
                  match.isActive
                    ? 'card-dark hover:bg-white/5'
                    : 'opacity-50 hover:opacity-70'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden">
                    <img
                      src={match.user.photos[0]}
                      alt={match.user.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {match.isActive && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-brand-dark" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">{match.user.name}</span>
                    {match.lastMessageTime && (
                      <span className="text-white/30 text-xs">{formatTime(match.lastMessageTime)}</span>
                    )}
                  </div>
                  <p className="text-white/50 text-xs truncate mt-0.5">
                    {match.lastMessage ?? 'Match nuevo — escribe primero 👋'}
                  </p>
                  <div className="mt-1">
                    <CountdownBadge deadline={match.deadline} isActive={match.isActive} />
                  </div>
                </div>

                {/* Unread badge */}
                {match.unread != null && match.unread > 0 && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
                  >
                    {match.unread}
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
