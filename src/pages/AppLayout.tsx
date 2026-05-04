import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { PWAInstall } from '../components/PWAInstall'
import { useProfile } from '../hooks/useProfile'
import { createContext, useContext } from 'react'
import type { Profile } from '../types/database'

interface ProfileCtx {
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
}

export const ProfileContext = createContext<ProfileCtx>({
  profile: null, loading: true, isAdmin: false, isSuperAdmin: false,
})

export const useProfileContext = () => useContext(ProfileContext)

export function AppLayout() {
  const profileData = useProfile()

  return (
    <ProfileContext.Provider value={profileData}>
      <div className="max-w-md mx-auto relative min-h-dvh">
        <Outlet />
        <BottomNav />
        <PWAInstall />
      </div>
    </ProfileContext.Provider>
  )
}
