'use client'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  return (
    <div className="text-center space-y-4">
      <div className="text-6xl">&#10003;</div>
      <h2 className="text-xl font-bold text-green-400">Payment Submitted</h2>
      <p className="text-gray-400 text-sm">
        Your payment is pending verification by the ST. You will receive a WhatsApp confirmation once verified.
      </p>
      <button onClick={() => router.push('/fees/dashboard')}
        className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl py-3 font-medium transition-colors">
        Back to Dashboard
      </button>
    </div>
  )
}
