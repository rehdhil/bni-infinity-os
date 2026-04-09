'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PhoneForm() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/fees/auth/request-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong')
      return
    }

    sessionStorage.setItem('bni_phone', phone)
    router.push('/fees/verify')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Mobile Number</label>
        <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden focus-within:border-red-600 focus-within:ring-2 focus-within:ring-red-600/10 bg-white">
          <span className="px-3 py-3 text-gray-500 text-sm border-r border-gray-300 bg-gray-50 select-none">+91</span>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="98765 43210"
            maxLength={10}
            inputMode="numeric"
            className="flex-1 bg-white px-3 py-3 text-gray-900 placeholder-gray-400 focus:outline-none"
            required
          />
        </div>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl py-3 font-semibold text-white transition-colors"
      >
        {loading ? 'Sending OTP…' : 'Get OTP on WhatsApp'}
      </button>
    </form>
  )
}
