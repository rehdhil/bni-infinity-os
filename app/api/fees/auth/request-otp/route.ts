import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateOTP, hashOTP } from '@/lib/fees/otp'
import { sendWhatsAppOTP } from '@/lib/whatsapp'

export async function POST(req: NextRequest) {
  const { phone } = await req.json()
  if (!phone) return NextResponse.json({ error: 'phone required' }, { status: 400 })

  const supabase = createServiceClient()

  // Check member exists and is active
  const { data: member } = await supabase
    .from('members')
    .select('id')
    .eq('phone', phone)
    .eq('status', 'active')
    .single()

  if (!member) return NextResponse.json({ error: 'Phone not found' }, { status: 404 })

  const otp = generateOTP()
  const otp_hash = await hashOTP(otp)
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 min

  await supabase.from('otp_sessions').insert({ phone, otp_hash, expires_at })

  await sendWhatsAppOTP(phone, otp)

  return NextResponse.json({ ok: true })
}
