import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Camera, Clock, Smile } from 'lucide-react'
import { getCountdown } from '../lib/utils'
import type { Message } from '../types'

const QUICK_ACTIONS = [
  'Te vi recién 👀',
  '¿Bailamos? 💃',
  '¿Un trago? 🍻',
  'Invitado al after 🌙',
  '¿Dónde estás? 📍',
  'Llegaste al nivel jefe 😈',
]

const MOCK_MESSAGES: Message[] = [
  { id: '1', senderId: 'other', text: 'Hola! te vi recién en la pista 👀', sentAt: new Date(Date.now() - 3 * 60000) },
  { id: '2', senderId: 'me', text: '¡Sí! También te vi jaja', sentAt: new Date(Date.now() - 2 * 60000) },
  { id: '3', senderId: 'other', text: '¿Seguís aquí? 👀', sentAt: new Date(Date.now() - 60000) },
]

export function Chat() {
  useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [text, setText] = useState('')
  const [showEphemeral, setShowEphemeral] = useState<string | null>(null)
  const [ephemeralTimer, setEphemeralTimer] = useState(5)
  const [deadline] = useState(new Date(Date.now() + 25 * 60000))
  const [countdown, setCountdown] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const id = setInterval(() => setCountdown(getCountdown(deadline)), 1000)
    setCountdown(getCountdown(deadline))
    return () => clearInterval(id)
  }, [deadline])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!text.trim()) return
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), senderId: 'me', text: text.trim(), sentAt: new Date() },
    ])
    setText('')
  }

  const handleEphemeral = () => {
    setShowEphemeral('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80')
    setEphemeralTimer(5)
    const id = setInterval(() => {
      setEphemeralTimer((t) => {
        if (t <= 1) { clearInterval(id); setShowEphemeral(null); return 5 }
        return t - 1
      })
    }, 1000)
  }

  const isUrgent = deadline.getTime() - Date.now() < 5 * 60000

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col">
      {/* Header */}
      <header className="glass border-b border-white/5 px-4 py-3 flex items-center gap-3 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center cursor-pointer text-white/60 hover:text-white transition-colors rounded-xl hover:bg-white/5"
          aria-label="Volver"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=100&q=80"
                alt="Valentina"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-brand-dark" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-tight">Valentina</p>
            <p className="text-white/40 text-xs">Aquí · Terraza VIP</p>
          </div>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 glass rounded-xl px-3 py-1.5 ${isUrgent ? 'border-brand-red/30' : ''}`}>
          <Clock size={12} className={isUrgent ? 'text-brand-red' : 'text-white/40'} />
          <span className={`text-xs font-mono font-bold ${isUrgent ? 'text-brand-red' : 'text-white/50'}`}>
            {countdown}
          </span>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me'
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  isMe
                    ? 'text-white rounded-br-sm'
                    : 'glass text-white/90 rounded-bl-sm'
                }`}
                style={isMe ? { background: 'linear-gradient(135deg, #E8192C, #E91E8C)' } : {}}
              >
                {msg.text}
              </div>
            </motion.div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Ephemeral photo overlay */}
      <AnimatePresence>
        {showEphemeral && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onContextMenu={(e) => e.preventDefault()}
          >
            <div className="relative w-full max-w-sm">
              <img src={showEphemeral} alt="" className="w-full rounded-2xl" draggable={false} />
              <div className="absolute top-3 right-3 glass-strong rounded-xl px-3 py-1.5 flex items-center gap-1.5">
                <Clock size={12} className="text-brand-red" />
                <span className="text-white font-bold text-sm">{ephemeralTimer}s</span>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden"
              >
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 5, ease: 'linear' }}
                  className="h-full"
                  style={{ background: 'linear-gradient(90deg, #E8192C, #E91E8C)' }}
                />
              </div>
            </div>
            <p className="absolute bottom-8 text-white/40 text-sm">Toca para cerrar</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick actions */}
      <div className="overflow-x-auto px-4 py-2 flex gap-2 no-scrollbar" style={{ scrollbarWidth: 'none' }}>
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            onClick={() => setText(action)}
            className="flex-shrink-0 glass rounded-2xl px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer whitespace-nowrap"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="px-4 py-3 safe-bottom flex items-end gap-3">
        <button
          onClick={handleEphemeral}
          className="w-10 h-10 glass-strong rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-white/10 transition-colors"
          aria-label="Foto efímera"
        >
          <Camera size={18} className="text-white/60" />
        </button>

        <div className="flex-1 glass rounded-2xl flex items-end px-4 py-2 gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Escribir mensaje..."
            className="flex-1 bg-transparent text-white text-sm resize-none focus:outline-none placeholder-white/30 max-h-24 leading-relaxed"
            rows={1}
            style={{ minHeight: '24px' }}
          />
          <button
            className="text-white/30 hover:text-white transition-colors cursor-pointer"
            aria-label="Emoji"
          >
            <Smile size={18} />
          </button>
        </div>

        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={sendMessage}
          disabled={!text.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 cursor-pointer transition-all disabled:opacity-30"
          style={{ background: text.trim() ? 'linear-gradient(135deg, #E8192C, #E91E8C)' : 'rgba(255,255,255,0.05)' }}
          aria-label="Enviar"
        >
          <Send size={16} className="text-white" />
        </motion.button>
      </div>
    </div>
  )
}
