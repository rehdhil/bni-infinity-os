import { NextRequest } from 'next/server'
import { timingSafeEqual } from 'crypto'

export function verifyCollectorPin(req: NextRequest): boolean {
  const pin = process.env.COLLECTOR_PIN
  if (!pin) throw new Error('COLLECTOR_PIN env var is required')
  const incoming = req.headers.get('x-collector-pin') ?? ''
  if (incoming.length !== pin.length) return false
  return timingSafeEqual(Buffer.from(incoming), Buffer.from(pin))
}
