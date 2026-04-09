'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Summary {
  totalCollected: number
  pendingVerification: number
  cashPending: number
  totalMembers: number
}

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const router = useRouter()

  useEffect(() => {
    const pin = sessionStorage.getItem('admin_pin') || ''
    const storedPin = sessionStorage.getItem('admin_pin')
    if (!sessionStorage.getItem('admin_auth') || !storedPin) { router.push('/fees/admin'); return }

    fetch('/api/fees/admin/summary', {
      headers: { 'x-admin-pin': pin },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setSummary)
      .catch(err => { if (err === 401) router.push('/fees/admin') })
  }, [router])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Chapter Fees</h2>
      {summary && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Collected', value: `₹${summary.totalCollected.toLocaleString('en-IN')}`, color: 'text-green-600' },
            { label: 'Pending Verify', value: summary.pendingVerification, color: 'text-amber-600' },
            { label: 'Cash Count', value: summary.cashPending, color: 'text-orange-600' },
            { label: 'Active Members', value: summary.totalMembers, color: 'text-gray-900' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <Link href="/fees/admin/members"
          className="block w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm transition-colors">
          Member Payment Table →
        </Link>
        <Link href="/fees/admin/meetings"
          className="block w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm transition-colors">
          Meeting Collection Windows →
        </Link>
        <Link href="/fees/admin/export"
          className="block w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 font-medium shadow-sm transition-colors">
          Export CSV →
        </Link>
      </div>
    </div>
  )
}
