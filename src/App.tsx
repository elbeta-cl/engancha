import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) {
    return (
      <div className="min-h-dvh bg-brand-dark flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-brand-red animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  if (!isLoaded) return null
  if (isSignedIn) return <Navigate to="/app" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Auth */}
          <Route path="/sign-in" element={<PublicOnlyRoute><AuthPage mode="sign-in" /></PublicOnlyRoute>} />
          <Route path="/sign-up" element={<PublicOnlyRoute><AuthPage mode="sign-up" /></PublicOnlyRoute>} />

          {/* Onboarding */}
          <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />

          {/* App (protected) */}
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
