import { SignIn, SignUp } from '@clerk/clerk-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'

interface Props {
  mode: 'sign-in' | 'sign-up'
}

export function AuthPage({ mode }: Props) {
  const navigate = useNavigate()

  return (
    <div className="min-h-dvh bg-brand-dark flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* BG glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #E8192C 0%, #7B2FBE 100%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm relative z-10"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <button onClick={() => navigate('/')} className="cursor-pointer">
            <img src={logo} alt="Engancha" className="w-24 h-auto mb-3" />
          </button>
          <p className="text-white/40 text-sm">
            {mode === 'sign-in' ? 'Bienvenido de vuelta' : 'Empieza tu noche'}
          </p>
        </div>

        {/* Clerk component */}
        <div className="clerk-auth">
          {mode === 'sign-in' ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              fallbackRedirectUrl="/app"
              appearance={{
                variables: {
                  colorPrimary: '#E8192C',
                  colorBackground: '#141414',
                  colorInputBackground: '#1e1e1e',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: 'rgba(255,255,255,0.5)',
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white font-bold',
                  headerSubtitle: 'text-white/50',
                  socialButtonsBlockButton: 'hidden',
                  socialButtonsProviderIcon: 'hidden',
                  dividerLine: 'hidden',
                  dividerText: 'hidden',
                  formFieldInput: 'bg-zinc-800 border-white/10 text-white placeholder-white/30',
                  formFieldLabel: 'text-white/60',
                  formButtonPrimary: 'bg-gradient-to-r from-brand-red to-brand-pink hover:opacity-90',
                  footerActionLink: 'text-brand-pink hover:text-brand-red',
                  identityPreviewText: 'text-white',
                  identityPreviewEditButton: 'text-brand-pink',
                },
              }}
            />
          ) : (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              fallbackRedirectUrl="/onboarding"
              appearance={{
                variables: {
                  colorPrimary: '#E8192C',
                  colorBackground: '#141414',
                  colorInputBackground: '#1e1e1e',
                  colorInputText: '#ffffff',
                  colorText: '#ffffff',
                  colorTextSecondary: 'rgba(255,255,255,0.5)',
                  borderRadius: '12px',
                  fontFamily: 'Inter, system-ui, sans-serif',
                },
                elements: {
                  card: 'bg-transparent shadow-none',
                  headerTitle: 'text-white font-bold',
                  headerSubtitle: 'text-white/50',
                  socialButtonsBlockButton: 'hidden',
                  socialButtonsProviderIcon: 'hidden',
                  dividerLine: 'hidden',
                  dividerText: 'hidden',
                  formFieldInput: 'bg-zinc-800 border-white/10 text-white placeholder-white/30',
                  formFieldLabel: 'text-white/60',
                  formButtonPrimary: 'bg-gradient-to-r from-brand-red to-brand-pink hover:opacity-90',
                  footerActionLink: 'text-brand-pink hover:text-brand-red',
                },
              }}
            />
          )}
        </div>
      </motion.div>
    </div>
  )
}
