import Image from 'next/image'

export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Image
            src="/BNI Logo.png"
            alt="BNI Infinity"
            width={120}
            height={60}
            className="mx-auto mb-2 object-contain"
            priority
          />
          <p className="text-gray-400 text-sm">Chapter Fee Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
