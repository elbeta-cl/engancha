import { useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Camera, Check } from 'lucide-react'
import icon from '../assets/icon.png'
import { supabase } from '../lib/supabase'

const MODES = [
  { key: 'conocer', label: 'Solo conocer', emoji: '🗣️', color: '#3B82F6' },
  { key: 'piquito', label: 'Piquito por cover', emoji: '💋', color: '#EC4899' },
  { key: 'bailar', label: 'Bailar', emoji: '💃', color: '#F59E0B' },
  { key: 'diablo', label: 'Diablo', emoji: '😈', color: '#E8192C' },
  { key: 'trago', label: 'Tomar algo', emoji: '🍻', color: '#10B981' },
  { key: 'after', label: 'El after', emoji: '🌙', color: '#7B2FBE' },
]

export function Onboarding() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [displayName, setDisplayName] = useState(user?.firstName ?? '')
  const [age, setAge] = useState('')
  const [selectedModes, setSelectedModes] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  const steps = ['Tu nombre', 'Tus fotos', 'Tus modos']

  const toggleMode = (key: string) => {
    if (selectedModes.includes(key)) {
      setSelectedModes((prev) => prev.filter((m) => m !== key))
    } else if (selectedModes.length < 3) {
      setSelectedModes((prev) => [...prev, key])
    }
  }

  const finish = async () => {
    if (!user) return
    setSaving(true)
    try {
      // 1. Actualizar Clerk
      await user.update({
        firstName: displayName.trim() || user.firstName || '',
        unsafeMetadata: { age: age ? parseInt(age) : null, modes: selectedModes, onboarded: true },
      })

      // 2. Crear perfil en Supabase
      const email = user.primaryEmailAddress?.emailAddress ?? null
      await supabase.from('profiles').upsert([{
        clerk_id: user.id,
        email,
        name: displayName.trim() || user.firstName || 'Usuario',
        age: age ? parseInt(age) : null,
        photos: user.imageUrl ? [user.imageUrl] : [],
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

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col">
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

      <div className="flex-1 px-5">
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
              <p className="text-white/40 text-sm mb-8">Mínimo 1, máximo 3. Sin avatares por defecto.</p>

              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`aspect-[3/4] rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                      i === 0
                        ? 'border-2 border-dashed border-brand-red/50 bg-brand-red/5'
                        : 'border border-dashed border-white/10 bg-white/3'
                    }`}
                  >
                    <Camera size={20} className={i === 0 ? 'text-brand-red' : 'text-white/20'} />
                    <span className={`text-xs mt-1.5 ${i === 0 ? 'text-brand-red' : 'text-white/20'}`}>
                      {i === 0 ? 'Principal' : `Foto ${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 glass rounded-2xl p-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={user?.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">Usar foto de Google</p>
                  <p className="text-white/40 text-xs">Ya tenemos tu foto de perfil</p>
                </div>
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}>
                  <Check size={12} className="text-white" />
                </div>
              </div>
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
          disabled={!canNext || saving}
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
