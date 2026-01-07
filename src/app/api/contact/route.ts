import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

// 1. Validation Schema (Security Best Practice)
// We define exactly what we accept. Anything else is rejected.
const contactSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

export async function POST(request: NextRequest) {
  try {
    // 2. Parse the JSON body
    const body = await request.json()

    // 3. Validate Input
    const validationResult = contactSchema.safeParse(body)
    
    if (!validationResult.success) {
      // Return specific error messages to the frontend
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { name, email, message, subject } = validationResult.data

    // 4. Database Insertion
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([
        { 
          name, 
          email, 
          message, 
          subject: subject || 'General Inquiry' // Default subject if empty
        }
      ])
      .select() // CRITICAL: This forces Supabase to return the inserted row
      .single()

    if (error) {
      console.error('Supabase Error:', error)
      throw new Error('Database insertion failed')
    }

    // 5. Future-Proofing (Placeholders for Phase 7)
    // await sendAdminNotification(data)
    // await sendUserConfirmation(data)

    return NextResponse.json(
      { success: true, message: 'Message received', id: data.id },
      { status: 201 }
    )

  } catch (error) {
    console.error('API Route Error:', error)
    
    // Generic error for the user, detailed log for us
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}