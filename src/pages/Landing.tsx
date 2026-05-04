import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Zap, Clock, Shield, Users, MessageCircle,
  ChevronDown, Star, Menu, X
} from 'lucide-react'
import logo from '../assets/logo.png'
import icon from '../assets/icon.png'

const FEATURES = [
  { icon: Zap, title: 'Swipe en tiempo real', desc: 'Ve quién está en el mismo local que tú y conecta al instante.' },
  { icon: MapPin, title: 'Geofencing inteligente', desc: 'Tus matches solo en el lugar donde estás. Cero perfiles fantasmas.' },
  { icon: Clock, title: 'Match timer 30 min', desc: 'La emoción tiene límite. Escribe antes de que expire o piérdelo.' },
  { icon: Shield, title: 'Fotos efímeras', desc: 'Comparte fotos que desaparecen en 5 segundos. Sin capturas.' },
  { icon: Users, title: 'Modos dinámicos', desc: 'Dinos qué buscas: bailar, conversar, o algo más travieso 😈' },
  { icon: MessageCircle, title: 'Chat privado', desc: 'Quick Actions nocturnas: "Invitar a bailar", "Trago", y más.' },
]

const STEPS = [
  { num: '01', title: 'Nombre + Fotos', desc: 'Crea tu perfil en menos de 30 segundos. Sin avatar por defecto.' },
  { num: '02', title: 'Elige tu modo', desc: 'Cuéntanos qué buscas esta noche. Hasta 3 modos activos.' },
  { num: '03', title: 'Engancha', desc: 'Swipe derecho, match instantáneo, chat en tiempo real.' },
]

const TESTIMONIALS = [
  { name: 'Valentina P.', text: '"Conocí a mi pololo en Bellavista gracias a Engancha 🔥 Sonaba random pero funciona."', age: 24 },
  { name: 'Matías R.', text: '"El timer de 30 minutos es adictivo. Te obliga a actuar o perder el match."', age: 27 },
  { name: 'Camila S.', text: '"Las fotos efímeras son lo mejor, no queda registro de nada 😂 pura vibe."', age: 22 },
]

export function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60])

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-dvh bg-brand-dark text-white overflow-x-hidden">
      {/* Fixed Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 40 ? 'glass border-b border-white/5' : ''}`}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <img src={icon} alt="Engancha" className="w-8 h-8" />
            <span className="font-display font-black text-xl text-gradient">ENGANCHA</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
            <a href="#how" className="hover:text-white transition-colors cursor-pointer">Cómo funciona</a>
            <a href="#features" className="hover:text-white transition-colors cursor-pointer">Features</a>
            <a href="#testimonials" className="hover:text-white transition-colors cursor-pointer">Testimonios</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/app')}
              className="btn-brand px-5 py-2 text-sm"
            >
              Entrar ahora
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 cursor-pointer text-white/60 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden glass border-t border-white/5 overflow-hidden"
            >
              <div className="flex flex-col gap-1 p-4">
                <a href="#how" onClick={() => setMenuOpen(false)} className="py-3 px-4 text-white/70 rounded-xl hover:bg-white/5 cursor-pointer">Cómo funciona</a>
                <a href="#features" onClick={() => setMenuOpen(false)} className="py-3 px-4 text-white/70 rounded-xl hover:bg-white/5 cursor-pointer">Features</a>
                <a href="#testimonials" onClick={() => setMenuOpen(false)} className="py-3 px-4 text-white/70 rounded-xl hover:bg-white/5 cursor-pointer">Testimonios</a>
                <button
                  onClick={() => navigate('/app')}
                  className="btn-brand py-3 mt-2 text-center"
                >
                  Entrar ahora
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero */}
      <section className="relative min-h-dvh flex flex-col items-center justify-center pt-16 px-5 overflow-hidden">
        {/* BG effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #E8192C 0%, #7B2FBE 50%, transparent 70%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #E91E8C 0%, transparent 70%)' }}
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-20 right-10 w-2 h-2 rounded-full bg-brand-pink opacity-60"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-40 left-10 w-3 h-3 rounded-full bg-brand-red opacity-40"
          />
        </div>

        <motion.div
          style={{ y: heroY }}
          className="relative z-10 flex flex-col items-center text-center max-w-2xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6 pill-brand px-4 py-2 text-sm font-medium rounded-full"
            style={{ background: 'rgba(232,25,44,0.15)', border: '1px solid rgba(232,25,44,0.3)', color: '#fff' }}
          >
            🌙 La app de la noche chilena
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="mb-6 animate-float"
          >
            <img
              src={logo}
              alt="Engancha"
              className="w-48 md:w-64 h-auto"
            />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-display text-5xl md:text-7xl font-black mb-4"
            style={{ lineHeight: '1.05', letterSpacing: '-0.03em' }}
          >
            Menos texto,{' '}
            <span className="text-gradient">más química.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/60 text-lg md:text-xl max-w-lg leading-relaxed"
          >
            Conocé gente donde realmente pasan las cosas.
            <br className="hidden md:block" /> Para la vida nocturna chilena.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto"
          >
            <button
              onClick={() => navigate('/app')}
              className="btn-brand py-4 px-8 text-base rounded-2xl animate-glow-pulse"
            >
              Engancha ahora 😈
            </button>
            <a
              href="#how"
              className="glass py-4 px-8 text-base rounded-2xl text-white/70 text-center hover:text-white hover:bg-white/10 transition-all cursor-pointer font-medium"
            >
              Cómo funciona
            </a>
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex items-center gap-4 text-sm text-white/40"
          >
            <div className="flex -space-x-2">
              {['#E8192C','#E91E8C','#7B2FBE','#FF6B35'].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-brand-dark" style={{ background: c }} />
              ))}
            </div>
            <span>+5,200 enganchados esta semana</span>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/20"
        >
          <ChevronDown size={24} />
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-brand-pink uppercase tracking-widest">Simple y rápido</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mt-3" style={{ letterSpacing: '-0.03em' }}>
              En 30 segundos{' '}
              <span className="text-gradient">estás listo</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative card-dark p-6"
              >
                <div
                  className="text-6xl font-black mb-4 text-gradient opacity-30 font-display"
                >
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.desc}</p>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(232,25,44,0.5), rgba(123,47,190,0.5))' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-5" style={{ background: 'linear-gradient(180deg, transparent, rgba(123,47,190,0.05), transparent)' }}>
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-brand-pink uppercase tracking-widest">Diseñado para la noche</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mt-3" style={{ letterSpacing: '-0.03em' }}>
              Todo lo que{' '}
              <span className="text-gradient">necesitás</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className="card-dark p-6 group cursor-default"
              >
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, rgba(232,25,44,0.2), rgba(123,47,190,0.2))', border: '1px solid rgba(232,25,44,0.2)' }}
                >
                  <feat.icon size={20} className="text-brand-pink" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{feat.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-brand-pink uppercase tracking-widest">Por qué Engancha</span>
              <h2 className="font-display text-4xl font-black mt-3 mb-6" style={{ letterSpacing: '-0.03em', lineHeight: '1.1' }}>
                El resto es para{' '}
                <span className="text-gradient">hacer citas.</span>
                <br />Engancha es para{' '}
                <span className="text-gradient">esta noche.</span>
              </h2>
              <div className="space-y-4">
                {[
                  ['Contexto real', 'Están en el mismo lugar que tú ahora mismo.'],
                  ['Sin algoritmos raros', 'Ves a todos los que están cerca. Punto.'],
                  ['Una mano, dos taps', 'Diseñado para la noche. Sin menús eternos.'],
                ].map(([title, desc]) => (
                  <div key={title} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }} />
                    <div>
                      <span className="text-white font-medium">{title}</span>
                      <p className="text-white/50 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex justify-center"
            >
              {/* Fake phone mockup */}
              <div className="relative w-64 h-[500px] rounded-[40px] overflow-hidden border border-white/10"
                style={{ background: 'linear-gradient(145deg, #141414, #1a0a0a)' }}>
                <div className="absolute inset-0 flex flex-col">
                  {/* Status bar */}
                  <div className="h-12 px-6 flex items-center justify-between">
                    <span className="text-white/50 text-xs">engancha.app</span>
                    <img src={icon} alt="" className="w-5 h-5" />
                  </div>
                  {/* Mock card */}
                  <div className="flex-1 mx-3 mb-16 rounded-2xl overflow-hidden relative"
                    style={{ background: 'linear-gradient(145deg, #1a0010, #0a0a1a)' }}>
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <h4 className="text-white font-bold text-xl">Valentina, 23</h4>
                      <p className="text-white/50 text-xs mb-2">Terraza · Sector VIP</p>
                      <div className="flex gap-2">
                        <span className="pill text-xs" style={{ color: '#fff', background: 'rgba(232,25,44,0.2)', border: '1px solid rgba(232,25,44,0.3)' }}>
                          💃 Bailar
                        </span>
                        <span className="pill text-xs" style={{ color: '#fff', background: 'rgba(123,47,190,0.2)', border: '1px solid rgba(123,47,190,0.3)' }}>
                          😈 Diablo
                        </span>
                      </div>
                    </div>
                    {/* Glow */}
                    <div className="absolute bottom-0 left-0 right-0 h-32"
                      style={{ background: 'linear-gradient(to top, rgba(232,25,44,0.15), transparent)' }} />
                  </div>
                  {/* Mock action buttons */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-6">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                      <X size={20} className="text-white/60" />
                    </div>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center glow-red"
                      style={{ background: 'linear-gradient(135deg, #E8192C, #E91E8C)' }}>
                      <span className="text-2xl">❤️</span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Glow behind phone */}
              <div className="absolute inset-0 -z-10 blur-3xl opacity-20"
                style={{ background: 'radial-gradient(circle, #E8192C 0%, #7B2FBE 100%)' }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-5">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-medium text-brand-pink uppercase tracking-widest">La gente habla</span>
            <h2 className="font-display text-4xl md:text-5xl font-black mt-3" style={{ letterSpacing: '-0.03em' }}>
              Real como la{' '}
              <span className="text-gradient">noche chilena</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-dark p-6"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-brand-red fill-brand-red" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{t.text}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg, #E8192C, #7B2FBE)' }} />
                  <span className="text-white/60 text-sm">{t.name} · {t.age}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="card-dark p-10 md:p-16 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10"
              style={{ background: 'radial-gradient(circle at 50% 50%, #E8192C 0%, #7B2FBE 60%, transparent 100%)' }}
            />
            <img src={logo} alt="" className="w-28 mx-auto mb-6 animate-float" />
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4" style={{ letterSpacing: '-0.03em' }}>
              La noche no{' '}
              <span className="text-gradient">espera.</span>
            </h2>
            <p className="text-white/50 text-lg mb-8">
              Descargá Engancha y conocé gente hoy mismo.
            </p>
            <button
              onClick={() => navigate('/app')}
              className="btn-brand py-4 px-10 text-lg rounded-2xl inline-block animate-glow-pulse"
            >
              Empezar ahora 😈
            </button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-5 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={icon} alt="" className="w-6 h-6" />
            <span className="font-display font-black text-gradient">ENGANCHA</span>
          </div>
          <div className="flex gap-6 text-sm text-white/30">
            <a href="/privacy" className="hover:text-white/60 transition-colors cursor-pointer">Privacidad</a>
            <a href="/help" className="hover:text-white/60 transition-colors cursor-pointer">Ayuda</a>
            <span>© 2025 engancha.app</span>
          </div>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 glass border-t border-white/5 z-40">
        <button
          onClick={() => navigate('/app')}
          className="btn-brand w-full py-4 text-base rounded-2xl"
        >
          Engancha ahora 😈
        </button>
      </div>
    </div>
  )
}
