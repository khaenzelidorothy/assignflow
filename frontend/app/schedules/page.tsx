import Link from 'next/link'

export default function SchedulesPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-3xl w-full bg-white shadow-sm rounded-3xl p-10">
        <h1 className="text-3xl font-bold mb-4">Schedules</h1>
        <p className="text-gray-600 mb-6">
          This is your schedule workspace. Create and review generated schedules from here.
        </p>
        <Link href="/dashboard" className="btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  )
}
