import { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import { supabase } from '../lib/supabase'
import type { Profile } from '../types/database'

export function useProfile() {
  const { user, isLoaded } = useUser()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoaded || !user) { setLoading(false); return }

    const init = async () => {
      // Buscar perfil existente
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('clerk_id', user.id)
        .single()

      if (data) {
        // Actualizar last_seen
        await supabase.from('profiles').update({ last_seen: new Date().toISOString() } as any).eq('clerk_id', user.id)
        setProfile(data as Profile)
      } else {
        // Crear perfil si no existe (usuarios que llegaron directo sin onboarding)
        const email = user.primaryEmailAddress?.emailAddress ?? null
        const { data: newProfile } = await supabase.from('profiles').upsert([{
          clerk_id: user.id,
          email,
          name: user.firstName || user.username || 'Usuario',
          photos: user.imageUrl ? [user.imageUrl] : [],
          modes: (user.unsafeMetadata?.modes as string[]) ?? [],
        }] as any, { onConflict: 'clerk_id' }).select().single()
        if (newProfile) setProfile(newProfile as Profile)
      }
      setLoading(false)
    }

    init()
  }, [isLoaded, user?.id])

  const isAdmin = profile?.role === 'super_admin' || profile?.role === 'venue_admin'
  const isSuperAdmin = profile?.role === 'super_admin'

  return { profile, loading, isAdmin, isSuperAdmin }
}
