'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const COLLECTOR_PIN = process.env.NEXT_PUBLIC_COLLECTOR_PIN ?? '1234'

export default function CollectorPINPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pin === COLLECTOR_PIN) {
      sessionStorage.setItem('collector_auth', 'true')
      router.push('/fees/collector/list')
    } else {
      setError('Incorrect PIN')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Collector Access</h2>
      <input type="password" value={pin} onChange={e => setPin(e.target.value)}
        placeholder="Enter PIN" maxLength={6}
        className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500" />
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold">
        Enter
      </button>
    </form>
  )
}
