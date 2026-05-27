import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Settings" description="Manage account preferences and organization details" />
        
        <div className="p-8">
          <div className="bg-white rounded-lg shadow p-8">
            <p className="text-gray-600 mb-6">
              Manage your account preferences, organization details, and scheduling settings here.
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
