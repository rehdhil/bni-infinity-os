'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface BalanceData {
  name: string
  totalDue: number
  unpaidMeetings: number
  unpaidFees: number
  hasTermPlan: boolean
  history: Array<{
    id: string
    amount: number
    method: string
    period_month: number
    period_year: number
    status: string
    created_at: string
  }>
}

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const STATUS_COLORS: Record<string, string> = {
  verified: 'text-green-400',
  pending_verification: 'text-yellow-400',
  rejected: 'text-red-400',
}

export default function BalanceCard() {
  const [data, setData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/fees/member/balance')
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setData)
      .catch(err => {
        if (err === 401) router.push('/fees')
        else setFetchError(true)
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) return <div className="text-center text-gray-500 py-10">Loading…</div>
  if (fetchError) return (
    <div className="text-center py-10 space-y-3">
      <p className="text-red-400">Failed to load balance. Please try again.</p>
      <button
        onClick={() => { setFetchError(false); window.location.reload() }}
        className="text-blue-400 text-sm"
      >
        Retry
      </button>
    </div>
  )
  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <p className="text-gray-400 text-sm">Hi, {data.name}</p>
        <p className="text-4xl font-bold mt-1">₹{data.totalDue.toLocaleString('en-IN')}</p>
        <p className="text-gray-400 text-sm mt-1">Total amount due</p>

        {data.totalDue > 0 && (
          <div className="mt-4 space-y-1 text-sm text-gray-500">
            {!data.hasTermPlan && data.unpaidMeetings > 0 && (
              <p>• {data.unpaidMeetings} meeting fee{data.unpaidMeetings > 1 ? 's' : ''} × ₹2,500</p>
            )}
            {data.unpaidFees > 0 && (
              <p>• Additional fees: ₹{data.unpaidFees.toLocaleString('en-IN')}</p>
            )}
          </div>
        )}

        {data.totalDue === 0 && (
          <p className="mt-3 text-green-400 text-sm font-medium">All payments up to date ✓</p>
        )}
      </div>

      {data.totalDue > 0 && (
        <button
          onClick={() => router.push('/fees/pay')}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold transition-colors"
        >
          Pay Now
        </button>
      )}

      {data.history.length > 0 && (
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <p className="text-sm font-medium text-gray-300 mb-3">Payment History</p>
          <div className="space-y-3">
            {data.history.map(h => (
              <div key={h.id} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-white">
                    {MONTH_NAMES[h.period_month - 1]} {h.period_year}
                  </p>
                  <p className="text-xs text-gray-500">{h.method}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">₹{h.amount.toLocaleString('en-IN')}</p>
                  <p className={`text-xs ${STATUS_COLORS[h.status] || 'text-gray-400'}`}>
                    {h.status.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
