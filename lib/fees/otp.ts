import { createHash } from 'crypto'

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function hashOTP(otp: string): Promise<string> {
  return createHash('sha256').update(otp + (process.env.OTP_SALT ?? 'bni-infinity')).digest('hex')
}

export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  const expected = await hashOTP(otp)
  return expected === hash
}
