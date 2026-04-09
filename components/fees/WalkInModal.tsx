'use client'
import { useState } from 'react'

export default function WalkInModal({ onClose, pin }: { onClose: () => void; pin: string }) {
  const [type, setType] = useState<'new_member' | 'visitor'>('visitor')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('2500')
  const [category, setCategory] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/fees/collector/walkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-collector-pin': pin },
      body: JSON.stringify({ type, name, phone, amount: parseInt(amount), category }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) {
      setError(data.error || 'Failed to record')
      return
    }
    setDone(true)
    setTimeout(onClose, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50">
      <div className="bg-white rounded-t-3xl p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Add Walk-in</h3>

        {done ? (
          <p className="text-green-600 text-center py-4 font-medium">Recorded ✓</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {(['visitor', 'new_member'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    type === t ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {t === 'visitor' ? 'Visitor' : 'New Member'}
                </button>
              ))}
            </div>

            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name" required
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10" />

            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="Phone number (optional)" type="tel"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10" />

            <input value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Amount" type="number" required min="1"
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10" />

            {type === 'new_member' && (
              <input value={category} onChange={e => setCategory(e.target.value)}
                placeholder="Business category"
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10" />
            )}

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl py-3 text-gray-600 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl py-3 font-semibold text-white transition-colors">
                {loading ? 'Saving\u2026' : 'Record'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
