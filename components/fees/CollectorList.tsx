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

export default function CollectorList() {
  const [members, setMembers] = useState<PendingMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [marked, setMarked] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem('collector_auth') !== 'true') {
      router.push('/fees/collector')
      return
    }
    fetch('/api/fees/collector/list')
      .then(r => r.json())
      .then(setMembers)
      .finally(() => setLoading(false))
  }, [router])

  async function handleMark(memberId: string, action: 'paid' | 'no_show') {
    await fetch('/api/fees/collector/mark', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, action }),
    })
    setMarked(prev => new Set([...prev, memberId]))
  }

  const active = members.filter(m => !marked.has(m.id))

  if (loading) return <div className="text-center text-gray-500 py-10">Loading\u2026</div>

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Cash Collection</h2>
          <p className="text-sm text-gray-400">{active.length} pending</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 rounded-xl px-4 py-2 text-sm font-medium">
          + Add Walk-in
        </button>
      </div>

      {active.length === 0 && (
        <div className="text-center text-green-400 py-8">All done! &#10003;</div>
      )}

      {active.map(m => (
        <div key={m.id} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-xs text-gray-500">{m.power_team}</p>
            </div>
            {m.payment_method === 'Cash' && (
              <span className="text-xs bg-yellow-900/30 text-yellow-400 px-2 py-1 rounded-lg">
                Pre-registered
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleMark(m.id, 'paid')}
              className="flex-1 bg-green-700 hover:bg-green-600 rounded-xl py-2 text-sm font-medium">
              Mark Paid &#8377;2,500
            </button>
            <button onClick={() => handleMark(m.id, 'no_show')}
              className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-xl py-2 text-sm text-gray-400">
              No Show
            </button>
          </div>
        </div>
      ))}

      {showModal && <WalkInModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
