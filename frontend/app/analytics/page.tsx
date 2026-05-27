'use client'

import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useAnalytics } from '@/hooks/useAnalytics'

export default function AnalyticsPage() {
  const { metrics, isLoading } = useAnalytics()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Analytics & Insights" description="System health, fairness, and performance metrics" />

        <div className="p-8">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Fairness Score</p>
              <p className={`text-3xl font-bold ${isLoading ? 'text-gray-400' : 'text-green-600'}`}>
                {isLoading ? '--' : Math.round(metrics?.fairness_score_avg || 0)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">Organization-wide</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Avg Assignments</p>
              <p className={`text-3xl font-bold ${isLoading ? 'text-gray-400' : 'text-blue-600'}`}>
                {isLoading ? '--' : (metrics?.avg_assignments_per_member || 0).toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-2">Per member</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Burnout Risk</p>
              <p className={`text-3xl font-bold ${isLoading ? 'text-gray-400' : 'text-red-600'}`}>
                {isLoading ? '--' : metrics?.burnout_risk_count || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Members at risk</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm mb-2">Total Assignments</p>
              <p className={`text-3xl font-bold ${isLoading ? 'text-gray-400' : 'text-indigo-600'}`}>
                {isLoading ? '--' : metrics?.total_assignments || 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">Across organization</p>
            </div>
          </div>

          {/* Analysis Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Workload Balance */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Workload Balance</h3>
              {isLoading ? (
                <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Overworked members (80%+ capacity):
                    <span className="font-semibold ml-2">
                      {metrics?.overworked_members_count || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Underutilized members (Less than 40%):
                    <span className="font-semibold ml-2">
                      {metrics?.underutilized_members_count || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Optimally balanced:
                    <span className="font-semibold ml-2">
                      {metrics?.optimally_balanced_members_count || 0}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Skill Coverage */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Skill Coverage</h3>
              {isLoading ? (
                <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Skills with shortage:
                    <span className="font-semibold ml-2 text-red-600">
                      {metrics?.scarce_skills_count || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Skills with adequate coverage:
                    <span className="font-semibold ml-2 text-green-600">
                      {metrics?.adequate_skills_count || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Overstaffed skills:
                    <span className="font-semibold ml-2 text-yellow-600">
                      {metrics?.overstaffed_skills_count || 0}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Attendance Trends */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance Patterns</h3>
              {isLoading ? (
                <div className="h-48 bg-gray-100 rounded animate-pulse"></div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-gray-700">
                    Reliable attendees (90%+ attendance):
                    <span className="font-semibold ml-2">
                      {metrics?.reliable_attendees_count || 0}
                    </span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Frequent absentees:
                    <span className="font-semibold ml-2 text-red-600">
                      {metrics?.frequent_absentees_count || 0}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Suggested Improvements */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Recommendations</h3>
              {isLoading ? (
                <div className="h-48 bg-blue-100 rounded animate-pulse"></div>
              ) : metrics?.suggestions && metrics.suggestions.length > 0 ? (
                <ul className="space-y-2">
                  {metrics.suggestions.map((suggestion: string, idx: number) => (
                    <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-blue-800">
                  All systems operating optimally. Keep monitoring for improvements.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
