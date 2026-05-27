'use client'

import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { SimpleBarChart } from '@/components/charts/SimpleBarChart'
import { PieChart } from '@/components/charts/PieChart'

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Analytics & Insights" description="Track scheduling metrics and performance" />
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Metrics */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Fairness Distribution</h3>
              <PieChart 
                data={[
                  { label: 'Fair', value: 78, color: '#10B981' },
                  { label: 'Moderate', value: 15, color: '#F59E0B' },
                  { label: 'Needs Work', value: 7, color: '#EF4444' },
                ]}
                size={150}
              />
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Assignment Frequency</h3>
              <SimpleBarChart 
                data={[
                  { label: 'John', value: 8, color: '#3B82F6' },
                  { label: 'Sarah', value: 6, color: '#8B5CF6' },
                  { label: 'Mike', value: 7, color: '#EC4899' },
                  { label: 'Lisa', value: 5, color: '#F59E0B' },
                  { label: 'David', value: 4, color: '#10B981' },
                ]}
                height={250}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Avg Assignments/Member</p>
              <p className="text-3xl font-bold text-gray-900">4.2</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Burnout Risk</p>
              <p className="text-3xl font-bold text-red-600">2</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Fairness Score</p>
              <p className="text-3xl font-bold text-green-600">87%</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Total Assignments</p>
              <p className="text-3xl font-bold text-blue-600">426</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
