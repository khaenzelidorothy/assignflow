import Link from 'next/link'

export default function GetStartedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-4">Get Started with AssignFlow</h1>
        <p className="text-gray-600 mb-6">
          Welcome! Create your first organization, add members, and start generating schedules in minutes.
        </p>
        <div className="space-x-3">
          <Link href="/" className="btn-secondary">
            Back to Home
          </Link>
          <Link href="/login" className="btn-primary">
            Sign In or Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}
