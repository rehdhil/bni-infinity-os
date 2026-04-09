'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// DEV ONLY — bypasses OTP for local testing
const TEST_MEMBERS = [
  { name: 'Rehdhil Siyad (ST)', email: 'rehdhil@tetherlo.com' },
  { name: 'Jim Prince (HNI)', email: 'jim@example.com' },
  { name: 'Sijo Chandran (arrears)', email: 'sijo@example.com' },
  { name: 'Shimjith Methatta (pending)', email: 'shimjith@example.com' },
]

export default function DevLoginPage() {
  const [customEmail, setCustomEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function login(email: string) {
    setLoading(true)
    setError('')
    const res = await fetch('/api/fees/auth/dev-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
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
        {TEST_MEMBERS.map(({ name, email }) => (
          <button key={email} onClick={() => login(email)} disabled={loading}
            className="w-full bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-left transition-colors disabled:opacity-50">
            <p className="text-sm font-medium text-gray-900">{name}</p>
            <p className="text-xs text-gray-400">{email}</p>
          </button>
        ))}
      </div>
      <div className="pt-2 border-t border-gray-100">
        <input
          type="email"
          value={customEmail}
          onChange={e => setCustomEmail(e.target.value)}
          placeholder="or enter any member email"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button onClick={() => login(customEmail)} disabled={loading || !customEmail}
          className="w-full mt-2 bg-gray-100 hover:bg-gray-200 rounded-xl py-2.5 text-sm text-gray-700 transition-colors disabled:opacity-50">
          Login with this email
        </button>
      </div>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  )
}
