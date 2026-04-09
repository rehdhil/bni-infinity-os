'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPINPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/fees/admin/summary', {
      headers: { 'x-admin-pin': pin },
    })
    setLoading(false)

    if (res.ok) {
      sessionStorage.setItem('admin_auth', 'true')
      sessionStorage.setItem('admin_pin', pin)
      router.push('/fees/admin/dashboard')
    } else {
      setError('Incorrect PIN')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Admin Access</h2>
      <input type="password" value={pin} onChange={e => setPin(e.target.value)}
        placeholder="Admin PIN" maxLength={6}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-3 font-semibold">
        {loading ? 'Checking…' : 'Enter'}
      </button>
    </form>
  )
}
