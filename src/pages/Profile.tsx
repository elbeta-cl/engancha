import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Camera, Edit2, Settings, Shield, HelpCircle, LogOut, ChevronRight, Crown } from 'lucide-react'
import { useProfileContext } from './AppLayout'

const ALL_MODES = [
  { key: 'conocer', label: 'Solo conocer', emoji: '🗣️', color: '#3B82F6' },
  { key: 'piquito', label: 'Piquito por cover', emoji: '💋', color: '#EC4899' },
  { key: 'bailar', label: 'Bailar', emoji: '💃', color: '#F59E0B' },
  { key: 'diablo', label: 'Diablo', emoji: '😈', color: '#E8192C' },
  { key: 'trago', label: 'Tomar algo', emoji: '🍻', color: '#10B981' },
  { key: 'after', label: 'El after', emoji: '🌙', color: '#7B2FBE' },
]

export function Profile() {
  const { user } = useUser()
  const { signOut } = useClerk()
  const navigate = useNavigate()
  const { profile, isSuperAdmin } = useProfileContext()
  const savedModes = profile?.modes ?? (user?.unsafeMetadata?.modes as string[]) ?? []
  const [activeModes, setActiveModes] = useState<string[]>(savedModes)
  const [editBio, setEditBio] = useState(false)
  const [bio, setBio] = useState('Aquí para vivir la noche 🔥')

  const toggleMode = (key: string) => {
    if (activeModes.includes(key)) {
      setActiveModes((prev) => prev.filter((m) => m !== key))
    } else if (activeModes.length < 3) {
      setActiveModes((prev) => [...prev, key])
    }
  }

  return (
    <div className="min-h-dvh bg-brand-dark pb-24">
      {/* Header */}
      <div className="relative">
        {/* Banner */}
        <div className="h-32 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(232,25,44,0.3), rgba(123,47,190,0.3))' }}>
          <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 50%, rgba(232,25,44,0.2), transparent 60%)' }} />
        </div>

        {/* Avatar */}
        <div className="absolute left-5 -bottom-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-brand-dark glow-red">
              <img
                src={user?.imageUrl ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}
                alt="Tu foto"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
              aria-label="Cambiar foto"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Edit button */}
        <div className="absolute right-4 bottom-3">
          <button
            className="glass rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <Edit2 size={12} /> Editar perfil
          </button>
        </div>
      </div>

      <div className="px-5 pt-16 space-y-5">
        {/* Name */}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-white text-2xl font-bold">
              {profile?.name ?? user?.firstName ?? 'Tu nombre'}
              {profile?.age ? `, ${profile.age}` : ''}
            </h1>
            {isSuperAdmin && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #E8192C, #7B2FBE)', color: '#fff' }}>
                <Crown size={10} /> SUPER ADMIN
              </span>
            )}
          </div>
          <p className="text-white/40 text-sm mt-0.5">{user?.primaryEmailAddress?.emailAddress}</p>
        </div>

        {/* Bio */}
        <div className="card-dark p-4">
          <div className="flex items-start justify-between">
            <p className="text-white/70 text-sm flex-1 pr-3 leading-relaxed">{bio}</p>
            <button
              onClick={() => setEditBio(!editBio)}
              className="text-white/30 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Editar bio"
            >
              <Edit2 size={14} />
            </button>
          </div>
          {editBio && (
            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="mt-3">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-brand-red/50"
                rows={2}
                maxLength={120}
              />
              <div className="flex justify-between mt-2">
                <span className="text-white/30 text-xs">{bio.length}/120</span>
                <button
                  onClick={() => setEditBio(false)}
                  className="text-xs text-brand-pink cursor-pointer"
                >
                  Guardar
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Modes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-semibold text-sm">Mis modos</h3>
            <span className="text-white/30 text-xs">{activeModes.length}/3 activos</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {ALL_MODES.map((mode) => {
              const active = activeModes.includes(mode.key)
              return (
                <motion.button
                  key={mode.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleMode(mode.key)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl transition-all cursor-pointer text-left ${
                    active ? 'border' : 'card-dark'
                  }`}
                  style={active ? {
                    background: `${mode.color}15`,
                    borderColor: `${mode.color}40`,
                  } : {}}
                >
                  <span className="text-xl">{mode.emoji}</span>
                  <span className={`text-sm font-medium ${active ? 'text-white' : 'text-white/50'}`}>
                    {mode.label}
                  </span>
                </motion.button>
              )
            })}
          </div>
          {activeModes.length >= 3 && (
            <p className="text-white/30 text-xs mt-2 text-center">Máximo 3 modos activos</p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Likes', value: '48' },
            { label: 'Matches', value: '12' },
            { label: 'Chats', value: '7' },
          ].map((stat) => (
            <div key={stat.label} className="card-dark p-3 text-center">
              <p className="font-display text-2xl font-black text-gradient">{stat.value}</p>
              <p className="text-white/40 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Settings menu */}
        <div className="card-dark overflow-hidden">
          {[
            { icon: Settings, label: 'Configuración', to: '/app/settings' },
            { icon: Shield, label: 'Privacidad', to: '/privacy' },
            { icon: HelpCircle, label: 'Ayuda', to: '/help' },
          ].map(({ icon: Icon, label }, i) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-4 text-white/70 hover:text-white hover:bg-white/5 transition-all cursor-pointer ${
                i > 0 ? 'border-t border-white/5' : ''
              }`}
            >
              <Icon size={16} />
              <span className="flex-1 text-sm text-left">{label}</span>
              <ChevronRight size={14} className="text-white/20" />
            </button>
          ))}
          <button
            onClick={() => signOut(() => navigate('/'))}
            className="w-full flex items-center gap-3 px-4 py-4 text-brand-red/70 hover:text-brand-red hover:bg-brand-red/5 transition-all cursor-pointer border-t border-white/5"
          >
            <LogOut size={16} />
            <span className="flex-1 text-sm text-left">Cerrar sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
