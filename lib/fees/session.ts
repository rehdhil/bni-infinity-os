import { jwtVerify } from 'jose'

export interface BniSession {
  memberId: string
  phone: string
  name: string
}

export async function getSession(cookieValue: string | undefined): Promise<BniSession | null> {
  if (!cookieValue) return null
  try {
    const secret = new TextEncoder().encode(process.env.SESSION_SECRET!)
    const { payload } = await jwtVerify(cookieValue, secret)
    return payload as unknown as BniSession
  } catch {
    return null
  }
}
