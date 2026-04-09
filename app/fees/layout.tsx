export default function FeesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white">BNI Infinity</h1>
          <p className="text-gray-400 text-sm mt-1">Chapter Fee Portal</p>
        </div>
        {children}
      </div>
    </div>
  )
}
