import { createHash, timingSafeEqual } from 'crypto'

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export function hashOTP(otp: string): string {
  const salt = process.env.OTP_SALT
  if (!salt) throw new Error('OTP_SALT env var is required')
  return createHash('sha256').update(otp + salt).digest('hex')
}

export function verifyOTP(otp: string, hash: string): boolean {
  const expected = hashOTP(otp)
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(hash, 'hex'))
}
