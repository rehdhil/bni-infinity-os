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
    if (!sessionStorage.getItem('admin_auth')) { router.push('/fees/admin'); return }

    fetch('/api/fees/admin/summary', {
      headers: { 'x-admin-pin': pin },
    })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(setSummary)
      .catch(err => { if (err === 401) router.push('/fees/admin') })
  }, [router])

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Chapter Fees</h2>
      {summary && (
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Collected', value: `₹${summary.totalCollected.toLocaleString('en-IN')}`, color: 'text-green-400' },
            { label: 'Pending Verify', value: summary.pendingVerification, color: 'text-yellow-400' },
            { label: 'Cash Count', value: summary.cashPending, color: 'text-orange-400' },
            { label: 'Active Members', value: summary.totalMembers, color: 'text-white' },
          ].map(s => (
            <div key={s.label} className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}
      <div className="space-y-2">
        <Link href="/fees/admin/members"
          className="block w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 text-sm">
          Member Payment Table →
        </Link>
        <Link href="/fees/admin/meetings"
          className="block w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 text-sm">
          Meeting Collection Windows →
        </Link>
        <Link href="/fees/admin/export"
          className="block w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 rounded-xl px-4 py-3 text-sm">
          Export CSV →
        </Link>
      </div>
    </div>
  )
}
