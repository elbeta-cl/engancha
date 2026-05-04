import { Outlet } from 'react-router-dom'
import { BottomNav } from '../components/BottomNav'
import { PWAInstall } from '../components/PWAInstall'

export function AppLayout() {
  return (
    <div className="max-w-md mx-auto relative min-h-dvh">
      <Outlet />
      <BottomNav />
      <PWAInstall />
    </div>
  )
}
