import { NextRequest } from 'next/server'

export function verifyCollectorPin(req: NextRequest): boolean {
  const pin = process.env.COLLECTOR_PIN
  if (!pin) throw new Error('COLLECTOR_PIN env var is required')
  return req.headers.get('x-collector-pin') === pin
}
