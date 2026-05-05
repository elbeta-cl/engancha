import { useState, useRef } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { ChevronRight, Camera, X, GripVertical, ImagePlus } from 'lucide-react'
import icon from '../assets/icon.png'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'

const MODES = [
  { key: 'conocer', label: 'Solo conocer', emoji: '🗣️', color: '#3B82F6' },
  { key: 'piquito', label: 'Piquito por cover', emoji: '💋', color: '#EC4899' },
  { key: 'bailar', label: 'Bailar', emoji: '💃', color: '#F59E0B' },
  { key: 'diablo', label: 'Diablo', emoji: '😈', color: '#E8192C' },
  { key: 'trago', label: 'Tomar algo', emoji: '🍻', color: '#10B981' },
  { key: 'after', label: 'El after', emoji: '🌙', color: '#7B2FBE' },
]

type Photo = { id: string; url: string }

export function Onboarding() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState(user?.firstName ?? '')
  const [age, setAge] = useState('')
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [selectedModes, setSelectedModes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingSlotRef = useRef<number>(0)

  const steps = ['Tu nombre', 'Tus fotos', 'Tus modos']

  const toggleMode = (key: string) => {
    if (selectedModes.includes(key)) {
      setSelectedModes((prev) => prev.filter((m) => m !== key))
    } else if (selectedModes.length < 3) {
      setSelectedModes((prev) => [...prev, key])
    }
  }

  const openFilePicker = (slotIndex: number) => {
    if (photos.length >= 3) return
    pendingSlotRef.current = slotIndex
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    e.target.value = ''

    setUploadError('')
    setUploading(true)

    try {
      const compressed = await compressImage(file).catch(() => file)
      const path = `${user.id}/${Date.now()}.jpg`

      const { error } = await supabase.storage
        .from('photos')
        .upload(path, compressed, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data } = supabase.storage.from('photos').getPublicUrl(path)
      const id = path

      setPhotos((prev) => [...prev, { id, url: data.publicUrl }].slice(0, 3))
    } catch (err: any) {
      console.error(err)
      setUploadError('No se pudo subir la foto. Verifica que el bucket "photos" exista en Supabase con acceso público.')
    } finally {
      setUploading(false)
    }
  }

  const importClerkPhoto = async () => {
    if (!user?.imageUrl || photos.length >= 3) return
    setUploadError('')
    setUploading(true)
    try {
      const res = await fetch(user.imageUrl)
      const blob = await res.blob()
      const ext = 'jpg'
      const path = `${user.id}/${Date.now()}.${ext}`

      const { error } = await supabase.storage
        .from('photos')
        .upload(path, blob, { contentType: 'image/jpeg', cacheControl: '3600', upsert: false })

      if (error) throw error

      const { data } = supabase.storage.from('photos').getPublicUrl(path)
      setPhotos((prev) => [...prev, { id: path, url: data.publicUrl }].slice(0, 3))
    } catch (err: any) {
      console.error(err)
      // Fallback: just use the clerk URL directly
      const id = `clerk_${Date.now()}`
      setPhotos((prev) => [...prev, { id, url: user.imageUrl! }].slice(0, 3))
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id))
  }

  const finish = async () => {
    if (!user) return
    setSaving(true)
    try {
      const photoUrls = photos.map((p) => p.url)
      const finalPhotos = photoUrls.length > 0 ? photoUrls : (user.imageUrl ? [user.imageUrl] : [])

      await user.update({
        firstName: displayName.trim() || user.firstName || '',
        unsafeMetadata: { age: age ? parseInt(age) : null, modes: selectedModes, onboarded: true },
      })

      const email = user.primaryEmailAddress?.emailAddress ?? null
      await supabase.from('profiles').upsert([{
        clerk_id: user.id,
        email,
        name: displayName.trim() || user.firstName || 'Usuario',
        age: age ? parseInt(age) : null,
        photos: finalPhotos,
        modes: selectedModes,
      }] as any, { onConflict: 'clerk_id' })

      navigate('/app')
    } catch (e) {
      console.error(e)
      setSaving(false)
    }
  }

  const canNext = step === 0
    ? displayName.trim().length >= 2
    : step === 1
    ? true
    : selectedModes.length > 0

  const emptySlots = Math.max(0, 3 - photos.length)

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-12 pb-6">
        <img src={icon} alt="Engancha" className="w-8 h-8" />
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className="h-1 rounded-full transition-all duration-300"
              style={{
                width: i === step ? 24 : 8,
                background: i <= step
                  ? 'linear-gradient(90deg, #E8192C, #E91E8C)'
                  : 'rgba(255,255,255,0.15)',
              }}
            />
          ))}
        </div>
        <span className="text-white/30 text-sm">{step + 1}/{steps.length}</span>
      </div>

      <div className="flex-1 px-5 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Step 0 — Nombre */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="font-display text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
                ¿Cómo te llaman?
              </h1>
              <p className="text-white/40 text-sm mb-8">Solo tu nombre, sin apellidos.</p>

              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Nombre</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej: Valentina"
                    maxLength={20}
                    autoFocus
                    className="w-full glass rounded-2xl px-4 py-4 text-white text-lg placeholder-white/20 focus:outline-none focus:border-brand-red/50 transition-colors border border-white/10"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs uppercase tracking-widest mb-2 block">Edad <span className="normal-case text-white/25">(opcional)</span></label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Ej: 24"
                    min={18}
                    max={60}
                    className="w-full glass rounded-2xl px-4 py-4 text-white text-lg placeholder-white/20 focus:outline-none focus:border-brand-red/50 transition-colors border border-white/10"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1 — Fotos */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="font-display text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
                Tus fotos
              </h1>
              <p className="text-white/40 text-sm mb-6">
                Máximo 3. <span className="text-white/25">Mantén y arrastra para reordenar.</span>
              </p>

              {/* Uploaded photos — drag to reorder */}
              {photos.length > 0 && (
                <Reorder.Group
                  axis="y"
                  values={photos}
                  onReorder={setPhotos}
                  className="space-y-3 mb-3"
                >
                  {photos.map((photo, i) => (
                    <Reorder.Item
                      key={photo.id}
                      value={photo}
                      className="flex items-center gap-3 glass rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing"
                      style={{ touchAction: 'none' }}
                      whileDrag={{ scale: 1.02, boxShadow: '0 8px 32px rgba(232,25,44,0.3)' }}
                    >
                      <div className="relative w-16 h-16 flex-shrink-0 overflow-hidden rounded-l-2xl">
                        <img src={photo.url} alt="" className="w-full h-full object-cover" />
                        {i === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 text-[9px] font-bold text-white text-center py-0.5"
                            style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}>
                            PRINCIPAL
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium">
                          {i === 0 ? 'Foto principal' : `Foto ${i + 1}`}
                        </p>
                        <p className="text-white/30 text-xs">Arrastra para reordenar</p>
                      </div>
                      <div className="flex items-center gap-2 pr-3">
                        <button
                          onPointerDown={(e) => e.stopPropagation()}
                          onClick={(e) => { e.stopPropagation(); removePhoto(photo.id) }}
                          className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center cursor-pointer"
                        >
                          <X size={14} className="text-white/60" />
                        </button>
                        <GripVertical size={18} className="text-white/20" />
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              )}

              {/* Empty slots */}
              {photos.length < 3 && (
                <div className={`grid gap-3 mb-4 ${emptySlots === 3 ? 'grid-cols-3' : emptySlots === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                  {Array.from({ length: emptySlots }).map((_, i) => (
                    <motion.button
                      key={i}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => openFilePicker(photos.length + i)}
                      disabled={uploading}
                      className="aspect-[3/4] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all border-2 border-dashed border-white/15 bg-white/3 hover:border-brand-red/40 hover:bg-brand-red/5 disabled:opacity-50"
                    >
                      {uploading && i === 0 ? (
                        <div className="w-6 h-6 rounded-full border-2 border-white/20 border-t-brand-red animate-spin" />
                      ) : (
                        <>
                          <Camera size={22} className="text-white/25 mb-1.5" />
                          <span className="text-white/25 text-xs">Agregar</span>
                        </>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Error */}
              {uploadError && (
                <p className="text-red-400 text-xs mb-4 text-center">{uploadError}</p>
              )}

              {/* Import from Clerk */}
              {user?.imageUrl && photos.length < 3 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={importClerkPhoto}
                  disabled={uploading}
                  className="w-full glass rounded-2xl p-3 flex items-center gap-3 cursor-pointer disabled:opacity-50"
                >
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                    <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white text-sm font-medium">Importar foto de perfil</p>
                    <p className="text-white/35 text-xs">Usar tu foto actual de Google</p>
                  </div>
                  <ImagePlus size={16} className="text-white/30 flex-shrink-0" />
                </motion.button>
              )}

              {photos.length === 0 && (
                <p className="text-white/20 text-xs text-center mt-4">Puedes continuar sin fotos</p>
              )}
            </motion.div>
          )}

          {/* Step 2 — Modos */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="font-display text-3xl font-black text-white mb-2" style={{ letterSpacing: '-0.03em' }}>
                ¿Qué buscás hoy?
              </h1>
              <p className="text-white/40 text-sm mb-8">
                Elige hasta 3 modos. Podés cambiarlos después.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {MODES.map((mode) => {
                  const active = selectedModes.includes(mode.key)
                  return (
                    <motion.button
                      key={mode.key}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => toggleMode(mode.key)}
                      className="flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer text-left border"
                      style={active ? {
                        background: `${mode.color}15`,
                        borderColor: `${mode.color}50`,
                      } : {
                        background: 'rgba(255,255,255,0.03)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <span className="text-2xl">{mode.emoji}</span>
                      <span className={`text-sm font-medium leading-tight ${active ? 'text-white' : 'text-white/50'}`}>
                        {mode.label}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
              {selectedModes.length >= 3 && (
                <p className="text-white/30 text-xs mt-3 text-center">Máximo 3 modos</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-5 pb-10 pt-6">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            if (step < steps.length - 1) setStep((s) => s + 1)
            else finish()
          }}
          disabled={!canNext || saving || uploading}
          className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-30 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}
        >
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : step === steps.length - 1 ? (
            <>¡Listo, engancha! 😈</>
          ) : (
            <>Continuar <ChevronRight size={18} /></>
          )}
        </motion.button>

        {step > 0 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="w-full text-center text-white/30 text-sm mt-3 py-2 cursor-pointer hover:text-white/50 transition-colors"
          >
            Volver
          </button>
        )}
      </div>
    </div>
  )
}
