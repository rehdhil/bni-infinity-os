import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyOTP } from '@/lib/fees/otp'

export async function POST(req: NextRequest) {
  const { phone, otp } = await req.json()
  if (!phone || !otp) return NextResponse.json({ error: 'phone and otp required' }, { status: 400 })

  const supabase = createServiceClient()

  // Get most recent unused, unexpired session
  const { data: session } = await supabase
    .from('otp_sessions')
    .select('id, otp_hash')
    .eq('phone', phone)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!session) return NextResponse.json({ error: 'OTP expired or not found' }, { status: 401 })

  const valid = await verifyOTP(otp, session.otp_hash)
  if (!valid) return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })

  // Mark session used
  await supabase.from('otp_sessions').update({ used: true }).eq('id', session.id)

  // Get member info for cookie
  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone')
    .eq('phone', phone)
    .single()

  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  const sessionData = Buffer.from(
    JSON.stringify({ memberId: member.id, phone: member.phone, name: member.name })
  ).toString('base64')

  const res = NextResponse.json({ ok: true, name: member.name })
  res.cookies.set('bni_session', sessionData, {
    httpOnly: true,
    path: '/fees',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
  })

  return res
}
