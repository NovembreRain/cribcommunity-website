import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { differenceInCalendarDays } from 'date-fns'

const bookingRequestSchema = z.object({
  property_id: z.string().uuid(),
  room_type_id: z.string().uuid(),
  guest_name: z.string().min(2),
  guest_email: z.string().email(),
  guest_phone: z.string().min(10),
  check_in: z.string(),
  check_out: z.string(),
  num_guests: z.number().min(1),
  special_requests: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // 1. Validation
    const validation = bookingRequestSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({ error: 'Validation Error', details: validation.error.flatten() }, { status: 400 })
    }
    
    const { 
      property_id, room_type_id, guest_name, guest_email, 
      guest_phone, check_in, check_out, num_guests, special_requests 
    } = validation.data

    // 2. Logic Check
    const start = new Date(check_in)
    const end = new Date(check_out)
    const nights = differenceInCalendarDays(end, start)

    if (nights < 1) {
      return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 })
    }

    // 3. Inventory Check
    // We check if the room exists first to catch 404s
    const { data: roomType, error: roomError } = await supabase
      .from('room_types')
      .select('price_per_night, total_units, capacity')
      .eq('id', room_type_id)
      .single()

    if (roomError) {
      // DEBUG: Return the specific DB error
      return NextResponse.json({ error: "DB Error: Room Fetch Failed", details: roomError }, { status: 500 })
    }

    // 4. Create Booking
    const total_price = roomType.price_per_night * nights

    const { data: booking, error: insertError } = await supabase
      .from('bookings')
      .insert([{
        property_id,
        room_type_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        num_guests,
        total_price,
        status: 'pending',
        special_requests
      }])
      .select()
      .single()

    if (insertError) {
      // DEBUG: Return the specific DB error (Likely RLS Policy)
      return NextResponse.json({ error: "DB Error: Insert Failed", details: insertError }, { status: 500 })
    }

    return NextResponse.json({ success: true, booking_id: booking.id }, { status: 201 })

  } catch (error: any) {
    // DEBUG: Catch code crashes (like missing libraries)
    console.error('CRITICAL API ERROR:', error)
    return NextResponse.json({ 
      error: "Critical Code Crash", 
      details: error.message || String(error) 
    }, { status: 500 })
  }
}