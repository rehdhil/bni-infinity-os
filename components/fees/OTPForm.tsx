'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OTPForm() {
  const [otp, setOtp] = useState('')
  const [phone, setPhone] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const p = sessionStorage.getItem('bni_phone')
    if (!p) router.push('/fees')
    else setPhone(p)
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/fees/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, otp }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Invalid OTP')
      return
    }

    router.push('/fees/dashboard')
  }

  if (phone === null) return null

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <p className="text-gray-500 text-sm text-center">
        OTP sent to <span className="text-gray-900 font-medium">{phone}</span> via WhatsApp
      </p>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Enter OTP</label>
        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          value={otp}
          onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
          placeholder="123456"
          className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
          required
        />
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl py-3 font-semibold text-white transition-colors"
      >
        {loading ? 'Verifying…' : 'Verify OTP'}
      </button>
      <button
        type="button"
        onClick={() => router.push('/fees')}
        className="w-full text-gray-400 text-sm hover:text-gray-600 transition-colors"
      >
        Back
      </button>
    </form>
  )
}
