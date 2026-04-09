'use client'
import { useRouter } from 'next/navigation'

export default function SuccessPage() {
  const router = useRouter()
  return (
    <div className="text-center space-y-4">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-bold text-gray-900">Payment Submitted</h2>
      <p className="text-gray-500 text-sm">
        Your payment is pending verification by the ST. You will receive a WhatsApp confirmation once verified.
      </p>
      <button onClick={() => router.push('/fees/dashboard')}
        className="w-full bg-gray-100 hover:bg-gray-200 rounded-xl py-3 font-medium text-gray-700 transition-colors">
        Back to Dashboard
      </button>
    </div>
  )
}
