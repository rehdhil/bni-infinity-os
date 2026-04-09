import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateOTP, hashOTP } from '@/lib/fees/otp'
import { sendWhatsAppOTP } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  let body: { phone?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { phone } = body
  if (typeof phone !== 'string' || !/^\+?[\d\s\-]{7,15}$/.test(phone)) {
    return NextResponse.json({ error: 'Invalid phone' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Check member exists and is active
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('phone', phone)
    .eq('status', 'active')
    .single()

  if (!member) return NextResponse.json({ error: 'Phone not found' }, { status: 404 })

  // Rate limit: max 3 OTPs per phone per minute
  const { count } = await supabase
    .from('otp_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('phone', phone)
    .gt('created_at', new Date(Date.now() - 60_000).toISOString())

  if ((count ?? 0) >= 3) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const otp = generateOTP()
  const otp_hash = hashOTP(otp)
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { data: inserted, error: insertError } = await supabase
    .from('otp_sessions')
    .insert({ phone, otp_hash, expires_at })
    .select('id')
    .single()

  if (insertError || !inserted) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  try {
    await sendWhatsAppOTP(phone, otp)
  } catch (err) {
    await supabase.from('otp_sessions').delete().eq('id', inserted.id)
    console.error('WhatsApp OTP send failed:', err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
