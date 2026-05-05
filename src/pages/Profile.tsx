import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useUser, useClerk } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { Camera, Edit2, Settings, Shield, HelpCircle, LogOut, ChevronRight, Crown, Loader2 } from 'lucide-react'
import { useProfileContext } from './AppLayout'
import { supabase } from '../lib/supabase'

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

  const [avatarUrl, setAvatarUrl] = useState('')
  const [coverUrl, setCoverUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  const [bio, setBio] = useState('')
  const [editBio, setEditBio] = useState(false)
  const [savingBio, setSavingBio] = useState(false)

  const [activeModes, setActiveModes] = useState<string[]>([])

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setAvatarUrl(profile.photos?.[0] || user?.imageUrl || '')
      setCoverUrl(profile.cover_photo || '')
      setBio(profile.bio || '')
      setActiveModes(profile.modes ?? [])
    } else if (user) {
      setAvatarUrl(user.imageUrl || '')
    }
  }, [profile, user?.imageUrl])

  const uploadToStorage = async (file: File, prefix: string): Promise<string | null> => {
    if (!user) return null
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${user.id}/${prefix}_${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('photos')
      .upload(path, file, { cacheControl: '3600', upsert: true })
    if (error) { console.error('Storage error:', error); return null }
    return supabase.storage.from('photos').getPublicUrl(path).data.publicUrl
  }

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    e.target.value = ''
    setUploadingAvatar(true)
    const url = await uploadToStorage(file, 'avatar')
    if (url) {
      setAvatarUrl(url)
      const rest = (profile?.photos ?? []).slice(1)
      await supabase
        .from('profiles')
        .update({ photos: [url, ...rest] } as any)
        .eq('clerk_id', user.id)
    }
    setUploadingAvatar(false)
  }

  const handleCoverFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    e.target.value = ''
    setUploadingCover(true)
    const url = await uploadToStorage(file, 'cover')
    if (url) {
      setCoverUrl(url)
      await supabase
        .from('profiles')
        .update({ cover_photo: url } as any)
        .eq('clerk_id', user.id)
    }
    setUploadingCover(false)
  }

  const saveBio = async () => {
    if (!user) return
    setSavingBio(true)
    await supabase
      .from('profiles')
      .update({ bio } as any)
      .eq('clerk_id', user.id)
    setSavingBio(false)
    setEditBio(false)
  }

  const toggleMode = async (key: string) => {
    if (!user) return
    let next: string[]
    if (activeModes.includes(key)) {
      next = activeModes.filter((m) => m !== key)
    } else if (activeModes.length < 3) {
      next = [...activeModes, key]
    } else {
      return
    }
    setActiveModes(next)
    await supabase
      .from('profiles')
      .update({ modes: next } as any)
      .eq('clerk_id', user.id)
  }

  return (
    <div className="min-h-dvh bg-brand-dark pb-24">
      {/* Hidden file inputs */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarFile}
      />
      <input
        ref={coverInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleCoverFile}
      />

      {/* Header */}
      <div className="relative">
        {/* Banner / Cover */}
        <button
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadingCover}
          className="w-full h-36 relative overflow-hidden block cursor-pointer group"
          aria-label="Cambiar foto de portada"
        >
          {coverUrl ? (
            <img src={coverUrl} alt="Portada" className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0"
                style={{ background: 'linear-gradient(135deg, rgba(232,25,44,0.35), rgba(123,47,190,0.35))' }} />
              <div className="absolute inset-0"
                style={{ background: 'radial-gradient(circle at 30% 50%, rgba(232,25,44,0.2), transparent 60%)' }} />
            </>
          )}
          {/* Overlay with camera icon */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-active:bg-black/50 transition-colors">
            {uploadingCover ? (
              <Loader2 size={24} className="text-white animate-spin" />
            ) : (
              <div className="flex flex-col items-center gap-1">
                <div className="w-10 h-10 rounded-full bg-black/40 border border-white/20 flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
                <span className="text-white/60 text-[10px]">Cambiar portada</span>
              </div>
            )}
          </div>
        </button>

        {/* Avatar */}
        <div className="absolute left-5 -bottom-12">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-brand-dark glow-red bg-white/10">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Tu foto" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-white/10" />
              )}
            </div>
            <button
              onClick={() => avatarInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer shadow-lg"
              style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
              aria-label="Cambiar foto de perfil"
            >
              {uploadingAvatar
                ? <Loader2 size={13} className="text-white animate-spin" />
                : <Camera size={13} className="text-white" />
              }
            </button>
          </div>
        </div>
      </div>

      <div className="px-5 pt-16 space-y-5">
        {/* Name */}
        <div>
          <div className="flex items-center gap-2 flex-wrap">
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
            <p className="text-white/70 text-sm flex-1 pr-3 leading-relaxed">
              {bio || <span className="text-white/25 italic">Sin bio aún...</span>}
            </p>
            <button
              onClick={() => setEditBio(!editBio)}
              className="text-white/30 hover:text-white transition-colors cursor-pointer flex-shrink-0"
              aria-label="Editar bio"
            >
              <Edit2 size={14} />
            </button>
          </div>
          {editBio && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-3 overflow-hidden"
            >
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-brand-red/50"
                rows={3}
                maxLength={120}
                placeholder="Cuéntanos algo..."
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-white/30 text-xs">{bio.length}/120</span>
                <button
                  onClick={saveBio}
                  disabled={savingBio}
                  className="text-xs text-brand-pink cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  {savingBio && <Loader2 size={11} className="animate-spin" />}
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
            { icon: Settings, label: 'Configuración' },
            { icon: Shield, label: 'Privacidad' },
            { icon: HelpCircle, label: 'Ayuda' },
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
