import { NextRequest } from 'next/server'

export function verifyAdminPin(req: NextRequest): boolean {
  const pin = process.env.ADMIN_PIN
  if (!pin) {
    console.error('ADMIN_PIN env var is not set')
    return false
  }
  return req.headers.get('x-admin-pin') === pin
}
