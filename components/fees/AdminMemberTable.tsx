'use client'
import { useState, useEffect } from 'react'

type Filter = 'all' | 'pending' | 'paid' | 'cash' | 'arrears'

interface MemberRow {
  id: string
  name: string
  phone: string
  power_team: string
  additional_fees: number
  payment: {
    id: string
    amount: number
    method: string
    status: string
    proof_url: string | null
  } | null
}

const STATUS_BADGE: Record<string, string> = {
  verified: 'bg-green-50 text-green-700 border border-green-200',
  pending_verification: 'bg-amber-50 text-amber-700 border border-amber-200',
  rejected: 'bg-red-50 text-red-700 border border-red-200',
}

export default function AdminMemberTable() {
  const [members, setMembers] = useState<MemberRow[]>([])
  const [filter, setFilter] = useState<Filter>('all')
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')

  useEffect(() => {
    setPin(sessionStorage.getItem('admin_pin') || '')
  }, [])

  function load(currentPin: string) {
    setLoading(true)
    fetch(`/api/fees/admin/members?filter=${filter}`, {
      headers: { 'x-admin-pin': currentPin },
    })
      .then(r => {
        if (!r.ok) throw new Error(r.status.toString())
        return r.json()
      })
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (pin) load(pin)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, pin])

  async function handleVerify(paymentId: string, action: 'verified' | 'rejected') {
    await fetch('/api/fees/payments/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-pin': pin },
      body: JSON.stringify({ paymentId, action }),
    })
    load(pin)
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {(['all', 'pending', 'paid', 'cash', 'arrears'] as Filter[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap font-medium transition-colors ${
              filter === f ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {loading && <div className="text-center text-gray-400 py-8">Loading…</div>}

      {!loading && members.map(m => (
        <div key={m.id} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-2">
          <div className="flex justify-between">
            <div>
              <p className="font-medium text-gray-900">{m.name}</p>
              <p className="text-xs text-gray-400">{m.power_team} · {m.phone}</p>
            </div>
            {m.additional_fees > 0 && (
              <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-lg">
                +₹{m.additional_fees.toLocaleString('en-IN')} dues
              </span>
            )}
          </div>

          {m.payment ? (
            <div className="flex justify-between items-center">
              <div>
                <span className={`text-xs px-2 py-1 rounded-lg ${STATUS_BADGE[m.payment.status] || 'bg-gray-100 text-gray-500'}`}>
                  {m.payment.status.replace(/_/g, ' ')}
                </span>
                <span className="text-xs text-gray-400 ml-2">
                  ₹{m.payment.amount.toLocaleString('en-IN')} · {m.payment.method}
                </span>
              </div>
              {m.payment.status === 'pending_verification' && (
                <div className="flex gap-2">
                  <button onClick={() => handleVerify(m.payment!.id, 'verified')}
                    className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg transition-colors">
                    Verify
                  </button>
                  <button onClick={() => handleVerify(m.payment!.id, 'rejected')}
                    className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg text-red-600 transition-colors">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ) : (
            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded-lg">No payment</span>
          )}
        </div>
      ))}
    </div>
  )
}
