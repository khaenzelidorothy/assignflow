import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function AvailabilityPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Availability Tracking" description="Track member availability and schedule windows" />
        
        <div className="p-8">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-600 mb-6">
              Track member availability and schedule windows to keep assignments balanced.
            </p>
            <Link href="/dashboard" className="btn-primary">
              Return to Dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
