'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ExportPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) router.push('/fees/admin')
  }, [router])

  async function handleExport() {
    setLoading(true)
    const pin = sessionStorage.getItem('admin_pin') || ''
    const res = await fetch('/api/fees/admin/export', {
      headers: { 'x-admin-pin': pin },
    })
    if (!res.ok) { setLoading(false); alert('Export failed'); return }
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bni-payments-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Export Payments</h2>
      <p className="text-gray-400 text-sm">Download complete payment records as CSV.</p>
      <button onClick={handleExport} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-3 font-semibold">
        {loading ? 'Preparing…' : 'Download CSV'}
      </button>
    </div>
  )
}
