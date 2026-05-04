import { motion, AnimatePresence } from 'framer-motion'
import { X, Share, Plus } from 'lucide-react'
import { usePWA } from '../hooks/usePWA'
import icon from '../assets/icon.png'

export function PWAInstall() {
  const { shouldShow, isIOS, install, dismiss } = usePWA()

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 right-4 z-50 glass-strong rounded-2xl p-4"
        >
          <div className="flex items-start gap-3">
            <img src={icon} alt="Engancha" className="w-12 h-12 rounded-xl flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm">Instala Engancha</p>
              {isIOS ? (
                <p className="text-white/60 text-xs mt-0.5 leading-snug">
                  Toca <Share size={10} className="inline" /> y luego "Agregar a inicio"
                </p>
              ) : (
                <p className="text-white/60 text-xs mt-0.5">Acceso rápido desde tu pantalla</p>
              )}
              {!isIOS && (
                <button
                  onClick={install}
                  className="mt-2 btn-brand text-xs px-4 py-1.5"
                >
                  Instalar
                </button>
              )}
            </div>
            <button
              onClick={dismiss}
              className="p-1 text-white/40 hover:text-white cursor-pointer transition-colors"
              aria-label="Cerrar"
            >
              <X size={16} />
            </button>
          </div>
          {isIOS && (
            <div className="mt-3 flex items-center gap-2 text-xs text-white/50 bg-white/5 rounded-xl p-2.5">
              <Share size={14} className="flex-shrink-0 text-brand-pink" />
              <span>Compartir</span>
              <span className="text-white/30">→</span>
              <Plus size={14} className="flex-shrink-0 text-brand-pink" />
              <span>Agregar a pantalla de inicio</span>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
