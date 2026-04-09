import { NextRequest } from 'next/server'

export function verifyAdminPin(req: NextRequest): boolean {
  const pin = process.env.ADMIN_PIN
  if (!pin) throw new Error('ADMIN_PIN env var is required')
  return req.headers.get('x-admin-pin') === pin
}
