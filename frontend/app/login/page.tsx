import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white shadow-sm rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-4">Sign In</h1>
        <p className="text-gray-600 mb-8">
          Access AssignFlow and manage schedules, members, and availability from one place.
        </p>
        <div className="space-x-3">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/dashboard" className="btn-primary">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
