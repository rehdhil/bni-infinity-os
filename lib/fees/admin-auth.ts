import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

export function verifyAdminPin(req: NextRequest): boolean {
  const pin = process.env.ADMIN_PIN
  if (!pin) throw new Error('ADMIN_PIN env var is required')
  const incoming = req.headers.get('x-admin-pin') ?? ''
  if (incoming.length !== pin.length) return false
  return timingSafeEqual(Buffer.from(incoming), Buffer.from(pin))
}
