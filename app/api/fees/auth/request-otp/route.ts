import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateOTP, hashOTP } from '@/lib/fees/otp'
import { sendEmailOTP } from '@/lib/email-otp'

export async function POST(req: NextRequest) {
  let body: { email?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { email } = body
  if (typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }
  const normalizedEmail = email.trim().toLowerCase()

  const supabase = createServiceClient()

  // Check member exists and is active
  const { data: member } = await supabase
    .from('members')
    .select('id, name')
    .eq('email', normalizedEmail)
    .eq('status', 'active')
    .single()

  if (!member) return NextResponse.json({ error: 'Email not found' }, { status: 404 })

  // Rate limit: max 3 OTPs per email per minute
  const { count } = await supabase
    .from('otp_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('email', normalizedEmail)
    .gt('created_at', new Date(Date.now() - 60_000).toISOString())

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const otp = generateOTP()
  const otp_hash = hashOTP(otp)
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { data: inserted, error: insertError } = await supabase
    .from('otp_sessions')
    .insert({ email: normalizedEmail, otp_hash, expires_at })
    .select('id')
    .single()

  if (insertError || !inserted) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  try {
    await sendEmailOTP(normalizedEmail, member.name, otp)
  } catch (err) {
    await supabase.from('otp_sessions').delete().eq('id', inserted.id)
    console.error('Email OTP send failed:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
