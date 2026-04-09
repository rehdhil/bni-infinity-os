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
    <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
      <div className="bg-gray-900 rounded-t-3xl p-6 w-full max-w-sm space-y-4">
        <h3 className="text-lg font-semibold">Add Walk-in</h3>

        {done ? (
          <p className="text-green-400 text-center py-4">Recorded &#10003;</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-2">
              {(['visitor', 'new_member'] as const).map(t => (
                <button key={t} type="button" onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium ${
                    type === t ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
                  }`}>
                  {t === 'visitor' ? 'Visitor' : 'New Member'}
                </button>
              ))}
            </div>

            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Full name" required
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none" />

            <input value={phone} onChange={e => setPhone(e.target.value)}
              placeholder="Phone number (optional)" type="tel"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none" />

            <input value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="Amount" type="number" required min="1"
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none" />

            {type === 'new_member' && (
              <input value={category} onChange={e => setCategory(e.target.value)}
                placeholder="Business category"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none" />
            )}

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <div className="flex gap-2">
              <button type="button" onClick={onClose}
                className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-xl py-3 text-gray-400">
                Cancel
              </button>
              <button type="submit" disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-3 font-semibold">
                {loading ? 'Saving\u2026' : 'Record'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
