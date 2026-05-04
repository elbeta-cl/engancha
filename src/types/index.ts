export interface UserMode {
  key: string
  label: string
  emoji: string
  color: string
}

export interface UserProfile {
  id: string
  name: string
  age?: number
  photos: string[]
  bio?: string
  modes: UserMode[]
  sector?: string
  distance?: number
  isHere?: boolean
}

export interface Match {
  id: string
  user: UserProfile
  matchedAt: Date
  deadline: Date
  isActive: boolean
  lastMessage?: string
  lastMessageTime?: Date
  unread?: number
}

export interface Message {
  id: string
  senderId: string
  text?: string
  isEphemeral?: boolean
  ephemeralPhoto?: string
  sentAt: Date
  read?: boolean
}

export interface Venue {
  id: string
  name: string
  address: string
  activeUsers: number
  isActive: boolean
  distance?: number
  isHere?: boolean
}

export type DiscoverMode = 'general' | 'venue'
