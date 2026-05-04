export type UserRole = 'user' | 'venue_admin' | 'super_admin'

export interface Profile {
  id: string
  clerk_id: string
  email: string | null
  name: string
  age: number | null
  bio: string | null
  photos: string[]
  modes: string[]
  role: UserRole
  current_venue_id: string | null
  current_sector: string | null
  is_active: boolean
  is_banned: boolean
  lat: number | null
  lng: number | null
  last_seen: string
  created_at: string
}

export interface Venue {
  id: string
  name: string
  address: string | null
  lat: number
  lng: number
  radius: number
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface Sector {
  id: string
  venue_id: string
  name: string
  order_index: number
  is_active: boolean
}

export interface Mode {
  id: string
  key: string
  label: string
  emoji: string
  color: string
  is_active: boolean
}

export interface Like {
  id: string
  from_user_id: string
  to_user_id: string
  venue_id: string | null
  created_at: string
}

export interface Match {
  id: string
  user1_id: string
  user2_id: string
  venue_id: string | null
  matched_at: string
  deadline: string
  is_active: boolean
}

export interface Message {
  id: string
  match_id: string
  sender_id: string
  text: string | null
  is_ephemeral: boolean
  photo_url: string | null
  is_moderated: boolean
  created_at: string
  read_at: string | null
}

export interface Report {
  id: string
  reporter_id: string
  reported_id: string
  reason: string
  details: string | null
  status: 'pending' | 'reviewed' | 'actioned'
  created_at: string
}

export interface Bot {
  id: string
  name: string
  photo_url: string | null
  bio: string | null
  is_active: boolean
  created_at: string
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      venues: { Row: Venue; Insert: Partial<Venue>; Update: Partial<Venue> }
      sectors: { Row: Sector; Insert: Partial<Sector>; Update: Partial<Sector> }
      modes: { Row: Mode; Insert: Partial<Mode>; Update: Partial<Mode> }
      likes: { Row: Like; Insert: Partial<Like>; Update: Partial<Like> }
      matches: { Row: Match; Insert: Partial<Match>; Update: Partial<Match> }
      messages: { Row: Message; Insert: Partial<Message>; Update: Partial<Message> }
      reports: { Row: Report; Insert: Partial<Report>; Update: Partial<Report> }
      bots: { Row: Bot; Insert: Partial<Bot>; Update: Partial<Bot> }
    }
  }
}
