import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function SchedulesPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Schedule Management" description="Create and review generated schedules" />
        
        <div className="p-8">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-600 mb-6">
              This is your schedule workspace. Create and review generated schedules from here.
            </p>
            <Link href="/dashboard" className="btn-primary">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
