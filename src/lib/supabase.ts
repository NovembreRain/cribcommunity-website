import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase Environment Variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// --- TYPE DEFINITIONS ---

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'blocked'

export interface Location {
  id: string
  slug: string
  name: string
  description: string | null
  cover_image: string | null
  is_active: boolean
  created_at: string
}

export interface Property {
  id: string
  location_id: string
  slug: string
  name: string
  description: string | null
  short_description: string | null
  address: string | null
  slideshow_images: string[] | null
  gallery_images: string[] | null
  video_url: string | null
  amenities: string[] | null
  rules: string | null
  created_at: string
}

export interface RoomType {
  id: string
  property_id: string
  name: string
  description: string | null
  capacity: number
  price_per_night: number
  total_units: number
  amenities: string[] | null
  images: string[] | null
  video_url: string | null
  created_at: string
}

export interface Booking {
  id: string
  property_id: string
  room_type_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in: string 
  check_out: string
  num_guests: number
  total_price: number | null
  status: BookingStatus
  special_requests: string | null
  created_at: string
}