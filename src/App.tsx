import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { AnimatePresence } from 'framer-motion'
import { Landing } from './pages/Landing'
import { AppLayout } from './pages/AppLayout'
import { AppHome } from './pages/AppHome'
import { Discover } from './pages/Discover'
import { Chats } from './pages/Chats'
import { Chat } from './pages/Chat'
import { Radar } from './pages/Radar'
import { Profile } from './pages/Profile'
import { AuthPage } from './pages/AuthPage'
import { Onboarding } from './pages/Onboarding'

const Spinner = () => (
  <div className="min-h-dvh bg-brand-dark flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-brand-red animate-spin" />
  </div>
)

function ProtectedRoute({ children, requireOnboarding = true }: {
  children: React.ReactNode
  requireOnboarding?: boolean
}) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()

  if (!isLoaded) return <Spinner />
  if (!isSignedIn) return <Navigate to="/sign-in" replace />

  const onboarded = user?.unsafeMetadata?.onboarded === true

  // Si requiere onboarding completo y no lo hizo → onboarding
  if (requireOnboarding && !onboarded) return <Navigate to="/onboarding" replace />

  // Si ya está onboarded y va a /onboarding → app
  if (!requireOnboarding && onboarded) return <Navigate to="/app" replace />

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  if (!isLoaded) return null
  if (isSignedIn) {
    const onboarded = user?.unsafeMetadata?.onboarded === true
    return <Navigate to={onboarded ? '/app' : '/onboarding'} replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Auth — solo para no autenticados */}
          <Route path="/sign-in" element={<PublicOnlyRoute><AuthPage mode="sign-in" /></PublicOnlyRoute>} />
          <Route path="/sign-up" element={<PublicOnlyRoute><AuthPage mode="sign-up" /></PublicOnlyRoute>} />

          {/* Onboarding — solo si está autenticado pero no onboarded */}
          <Route path="/onboarding" element={<ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>} />

          {/* App — autenticado + onboarding completo */}
          <Route path="/app" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<AppHome />} />
            <Route path="discover" element={<Discover />} />
            <Route path="chats" element={<Chats />} />
            <Route path="chat/:matchId" element={<Chat />} />
            <Route path="radar" element={<Radar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
