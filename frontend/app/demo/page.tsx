import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-4">Watch Demo</h1>
        <p className="text-gray-600 mb-6">
          Explore AssignFlow's scheduling workflow with an interactive guided demo.
        </p>
        <div className="space-x-3">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Visit Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
