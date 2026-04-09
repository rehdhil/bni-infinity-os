import { jwtVerify } from 'jose'

export interface BniSession {
  memberId: string
  phone: string
  name: string
}

export async function getSession(cookieValue: string | undefined): Promise<BniSession | null> {
  if (!cookieValue) return null
  const raw = process.env.SESSION_SECRET
  if (!raw) throw new Error('SESSION_SECRET is not set')
  try {
    const secret = new TextEncoder().encode(raw)
    const { payload } = await jwtVerify(cookieValue, secret, {
      audience: 'bni-infinity',
      issuer: 'bni-infinity',
    })
    return payload as unknown as BniSession
  } catch {
    return null
  }
}
