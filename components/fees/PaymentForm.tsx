'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { isTermStart } from '@/lib/fees/plans'

type Method = 'UPI' | 'CC' | 'Cash'

export default function PaymentForm() {
  const [method, setMethod] = useState<Method>('UPI')
  const [amount, setAmount] = useState('2500')
  const [txRef, setTxRef] = useState('')
  const [proof, setProof] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const showTermPlan = isTermStart(new Date())
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData()
    fd.append('amount', amount)
    fd.append('method', method)
    if (txRef) fd.append('transaction_ref', txRef)
    if (proof) fd.append('proof', proof)

    const res = await fetch('/api/fees/payments/submit', { method: 'POST', body: fd })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) { setError(data.error || 'Submission failed'); return }
    router.push('/fees/pay/success')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Payment Amount</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="radio" name="amount" value="2500"
              checked={amount === '2500'}
              onChange={() => setAmount('2500')}
              className="accent-blue-500" />
            <span>&#8377;2,500 &mdash; Monthly fee</span>
          </label>
          {showTermPlan && (
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="radio" name="amount" value="14500"
                checked={amount === '14500'}
                onChange={() => setAmount('14500')}
                className="accent-blue-500" />
              <span>&#8377;14,500 &mdash; 6-month term (save &#8377;500)</span>
            </label>
          )}
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl p-4 border border-gray-800">
        <p className="text-sm text-gray-400 mb-3">Payment Method</p>
        <div className="flex gap-2">
          {(['UPI', 'CC', 'Cash'] as const).map(m => (
            <button key={m} type="button"
              onClick={() => setMethod(m)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                method === m ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'
              }`}>
              {m === 'CC' ? 'Card' : m}
            </button>
          ))}
        </div>
      </div>

      {(method === 'UPI' || method === 'CC') && (
        <>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              {method === 'UPI' ? 'UPI Transaction ID' : 'Card Reference Number'}
            </label>
            <input value={txRef} onChange={e => setTxRef(e.target.value)}
              placeholder={method === 'UPI' ? 'e.g. 123456789012' : 'Last 4 digits or ref'}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Upload Payment Screenshot *</label>
            <input type="file" accept="image/*,application/pdf"
              onChange={e => setProof(e.target.files?.[0] || null)}
              className="w-full text-gray-400 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-600 file:text-white" />
          </div>
        </>
      )}

      {method === 'Cash' && (
        <div className="bg-yellow-900/20 border border-yellow-700/30 rounded-xl p-3">
          <p className="text-yellow-400 text-sm">
            Pay cash at the door. Please have &#8377;{parseInt(amount).toLocaleString('en-IN')} ready.
          </p>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-3 font-semibold transition-colors">
        {loading ? 'Submitting\u2026' : method === 'Cash' ? 'Confirm Cash Payment' : 'Submit Payment'}
      </button>
    </form>
  )
}
