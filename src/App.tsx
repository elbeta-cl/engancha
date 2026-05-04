import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { Landing } from './pages/Landing'
import { AppLayout } from './pages/AppLayout'
import { AppHome } from './pages/AppHome'
import { Discover } from './pages/Discover'
import { Chats } from './pages/Chats'
import { Chat } from './pages/Chat'
import { Radar } from './pages/Radar'
import { Profile } from './pages/Profile'

export default function App() {
  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* App */}
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<AppHome />} />
            <Route path="discover" element={<Discover />} />
            <Route path="chats" element={<Chats />} />
            <Route path="chat/:matchId" element={<Chat />} />
            <Route path="radar" element={<Radar />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  )
}
