import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

// 1. Strict Validation Schema
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // 2. Validate Input
    const validationResult = newsletterSchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid email', details: validationResult.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = validationResult.data

    // 3. Database Insertion
    const { error } = await supabase
      .from('newsletter_signups')
      .insert([{ email }])

    // 4. Handle "Already Subscribed" Gracefully
    if (error) {
      if (error.code === '23505') { // Postgres code for Unique Violation
        return NextResponse.json(
          { message: 'You are already on the list!' },
          { status: 200 } // We return 200 OK, not an error, for better UX
        )
      }
      throw error // Throw other unknown errors to the catch block
    }

    // 5. Success
    return NextResponse.json(
      { message: 'Welcome to the tribe!' },
      { status: 201 }
    )

  } catch (error) {
    console.error('Newsletter API Error:', error)
    return NextResponse.json(
      { error: 'Subscription failed. Please try again later.' },
      { status: 500 }
    )
  }
}