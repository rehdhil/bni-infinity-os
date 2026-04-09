import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { createServiceClient } from '@/lib/supabase/server'

// DEV ONLY — bypasses OTP, never runs in production
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available' }, { status: 404 })
  }

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

  const supabase = createServiceClient()
  const { data: member } = await supabase
    .from('members')
    .select('id, name, phone')
    .eq('email', email.trim().toLowerCase())
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
    secure: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  })
  return res
}
