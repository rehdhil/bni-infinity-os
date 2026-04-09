import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createServiceClient } from '@/lib/supabase/server'
import { verifyOTP } from '@/lib/fees/otp'

export async function POST(req: NextRequest) {
  if (!process.env.SESSION_SECRET) throw new Error('SESSION_SECRET is not set')
  let body: { phone?: unknown; otp?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { phone, otp } = body
  if (typeof phone !== 'string' || typeof otp !== 'string') {
    return NextResponse.json({ error: 'phone and otp required' }, { status: 400 })
  }

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

  const valid = verifyOTP(otp, session.otp_hash)
  if (!valid) return NextResponse.json({ error: 'Invalid OTP' }, { status: 401 })

  // Atomically mark session used — guard prevents replay
  const { data: updated } = await supabase
    .from('otp_sessions')
    .update({ used: true })
    .eq('id', session.id)
    .eq('used', false)
    .select('id')

  if (!updated || updated.length === 0) {
    return NextResponse.json({ error: 'OTP already used' }, { status: 401 })
  }

  // Get member info for JWT
  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone')
    .eq('phone', phone)
    .single()

  if (!member) return NextResponse.json({ error: 'Member not found' }, { status: 404 })

  const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)
  const token = await new SignJWT({ memberId: member.id, phone: member.phone, name: member.name })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .setAudience('bni-infinity')
    .setIssuer('bni-infinity')
    .sign(secret)

  const res = NextResponse.json({ ok: true, name: member.name })
  res.cookies.set('bni_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/fees',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })

  return res
}
