'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import WalkInModal from './WalkInModal'

interface PendingMember {
  id: string
  name: string
  power_team: string
  payment_method: string | null
  payment_status: string
}

interface CardState {
  amount: string
  method: 'Cash' | 'UPI' | 'Card'
  proof: File | null
  previewUrl: string | null
}

export default function CollectorList() {
  const [members, setMembers] = useState<PendingMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [marked, setMarked] = useState<Set<string>>(new Set())
  const [cardState, setCardState] = useState<Record<string, CardState>>({})
  const [query, setQuery] = useState('')
  const [pin, setPin] = useState('')
  const router = useRouter()

  useEffect(() => {
    const storedPin = sessionStorage.getItem('collector_pin') || ''
    if (sessionStorage.getItem('collector_auth') !== 'true' || !storedPin) {
      router.push('/fees/collector')
      return
    }
    setPin(storedPin)
    fetch('/api/fees/collector/list', {
      headers: { 'x-collector-pin': storedPin },
    })
      .then(r => r.json())
      .then((data: PendingMember[]) => {
        setMembers(data)
        const initial: Record<string, CardState> = {}
        data.forEach(m => { initial[m.id] = { amount: '2500', method: 'Cash', proof: null, previewUrl: null } })
        setCardState(initial)
      })
      .finally(() => setLoading(false))
  }, [router])

  function updateCard(memberId: string, patch: Partial<CardState>) {
    setCardState(prev => ({ ...prev, [memberId]: { ...prev[memberId], ...patch } }))
  }

  function handleProofChange(memberId: string, file: File | null) {
    if (cardState[memberId]?.previewUrl) {
      URL.revokeObjectURL(cardState[memberId].previewUrl!)
    }
    updateCard(memberId, {
      proof: file,
      previewUrl: file ? URL.createObjectURL(file) : null,
    })
  }

  async function handleMark(memberId: string, action: 'paid' | 'no_show') {
    const state = cardState[memberId]
    const form = new FormData()
    form.append('memberId', memberId)
    form.append('action', action)
    if (action === 'paid') {
      form.append('amount', String(Number(state?.amount) || 2500))
      form.append('method', state?.method ?? 'Cash')
      if (state?.proof) form.append('proof', state.proof)
    }
    await fetch('/api/fees/collector/mark', {
      method: 'POST',
      headers: { 'x-collector-pin': pin },
      body: form,
    })
    setMarked(prev => new Set([...prev, memberId]))
  }

  const active = members.filter(m => !marked.has(m.id))
  const visible = query.trim()
    ? active.filter(m => m.name.toLowerCase().includes(query.toLowerCase()))
    : active

  if (loading) return <div className="text-center text-gray-400 py-10">Loading…</div>

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Fee Collection</h2>
          <p className="text-sm text-gray-400">
            {query ? `${visible.length} of ${active.length} pending` : `${active.length} pending`}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors">
          + Add Walk-in
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="search"
          placeholder="Search member…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>

      {visible.length === 0 && (
        query
          ? <div className="text-center text-gray-400 py-8 text-sm">No member found</div>
          : <div className="text-center text-green-600 py-8 font-medium">All done! ✓</div>
      )}

      {visible.map(m => {
        const state = cardState[m.id] ?? { amount: '2500', method: 'Cash' as const, proof: null, previewUrl: null }
        return (
          <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-medium text-gray-900">{m.name}</p>
                <p className="text-xs text-gray-400">{m.power_team}</p>
              </div>
              {m.payment_method === 'Cash' && (
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-1 rounded-lg">
                  Pre-registered
                </span>
              )}
            </div>

            {/* Payment method + amount row */}
            <div className="flex gap-2 mb-3">
              {/* Method toggle */}
              <div className="flex rounded-lg border border-gray-200 overflow-hidden text-sm font-medium">
                {(['Cash', 'UPI', 'Card'] as const).map(method => (
                  <button
                    key={method}
                    onClick={() => updateCard(m.id, { method })}
                    className={`px-3 py-1.5 transition-colors ${
                      state.method === method
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
              {/* Amount input */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={state.amount}
                  onChange={e => updateCard(m.id, { amount: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-1.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            {/* Proof upload */}
            <div className="mb-3">
              {state.previewUrl ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={state.previewUrl} alt="proof" className="w-full h-32 object-cover rounded-lg border border-gray-200" />
                  <button
                    onClick={() => handleProofChange(m.id, null)}
                    className="absolute top-1 right-1 bg-white border border-gray-200 rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-600 text-xs shadow-sm"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <label className="flex items-center gap-2 text-sm text-gray-400 border border-dashed border-gray-300 rounded-lg px-3 py-2 cursor-pointer hover:border-gray-400 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <span>Upload proof <span className="text-gray-300">(optional)</span></span>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={e => handleProofChange(m.id, e.target.files?.[0] ?? null)}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => handleMark(m.id, 'paid')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-xl py-2 text-sm font-medium transition-colors">
                Mark Paid
              </button>
              <button onClick={() => handleMark(m.id, 'no_show')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-xl py-2 text-sm text-gray-600 transition-colors">
                No Show
              </button>
            </div>
          </div>
        )
      })}

      {showModal && <WalkInModal onClose={() => setShowModal(false)} pin={pin} />}
    </div>
  )
}
