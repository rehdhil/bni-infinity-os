import { generateOTP, hashOTP, verifyOTP } from '../otp'

describe('OTP', () => {
  test('generateOTP returns 6-digit string', () => {
    const otp = generateOTP()
    expect(otp).toMatch(/^\d{6}$/)
  })

  test('hashOTP produces consistent hash', async () => {
    const hash1 = await hashOTP('123456')
    const hash2 = await hashOTP('123456')
    expect(hash1).toBe(hash2)
  })

  test('verifyOTP returns true for matching hash', async () => {
    const otp = '123456'
    const hash = await hashOTP(otp)
    expect(await verifyOTP(otp, hash)).toBe(true)
  })

  test('verifyOTP returns false for wrong OTP', async () => {
    const hash = await hashOTP('123456')
    expect(await verifyOTP('999999', hash)).toBe(false)
  })
})
