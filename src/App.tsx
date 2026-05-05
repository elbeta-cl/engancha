import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-react'
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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY')

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

  if (requireOnboarding && !onboarded) return <Navigate to="/onboarding" replace />
  if (!requireOnboarding && onboarded) return <Navigate to="/app" replace />

  return <>{children}</>
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  if (!isLoaded) return <Spinner />
  if (isSignedIn) {
    const onboarded = user?.unsafeMetadata?.onboarded === true
    return <Navigate to={onboarded ? '/app' : '/onboarding'} replace />
  }
  return <>{children}</>
}

// ClerkProvider must be inside BrowserRouter to access useNavigate
function ClerkProviderWithRouter({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}
      afterSignOutUrl="/"
      afterSignInUrl="/app"
      afterSignUpUrl="/onboarding"
    >
      {children}
    </ClerkProvider>
  )
}

function AppRoutes() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />

        {/* Auth — wildcard paths for Clerk's internal sub-routing */}
        <Route path="/sign-in/*" element={<PublicOnlyRoute><AuthPage mode="sign-in" /></PublicOnlyRoute>} />
        <Route path="/sign-up/*" element={<PublicOnlyRoute><AuthPage mode="sign-up" /></PublicOnlyRoute>} />

        {/* Onboarding */}
        <Route path="/onboarding" element={<ProtectedRoute requireOnboarding={false}><Onboarding /></ProtectedRoute>} />

        {/* App */}
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRouter>
        <AppRoutes />
      </ClerkProviderWithRouter>
    </BrowserRouter>
  )
}
