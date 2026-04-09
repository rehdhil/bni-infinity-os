'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// DEV ONLY — bypasses OTP for local testing
const TEST_PHONES = [
  { name: 'Rehdhil Siyad (ST)', phone: '+91 9544 559 292' },
  { name: 'Jim Prince (HNI)', phone: '+91 9447 025 334' },
  { name: 'Sijo Chandran (arrears)', phone: '+91 9656 465 151' },
  { name: 'Shimjith Methatta (pending)', phone: '+91 9744 195 504' },
]

export default function DevLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function login(phone: string) {
    setLoading(true)
    setError('')
    const res = await fetch('/api/fees/auth/dev-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error); return }
    router.push('/fees/dashboard')
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-amber-700 text-xs font-medium">DEV MODE — OTP bypassed</p>
      </div>
      <p className="text-gray-500 text-sm">Login as:</p>
      <div className="space-y-2">
        {TEST_PHONES.map(({ name, phone }) => (
          <button key={phone} onClick={() => login(phone)} disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-left transition-colors disabled:opacity-50">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{phone}</p>
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
