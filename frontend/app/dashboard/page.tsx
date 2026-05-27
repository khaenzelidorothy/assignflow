'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { useDashboard } from '@/hooks/useDashboard'
import { useSchedules } from '@/hooks/useSchedules'

function LoadingCard() {
  return (
    <div className="bg-white rounded-lg shadow p-6 animate-pulse">
      <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
      <div className="h-8 w-16 bg-gray-200 rounded"></div>
    </div>
  )
}

export default function DashboardPage() {
  const { summary, isLoading, isEverythingOkay, getHealthStatus, getMostUrgentAlert, refreshDashboard } = useDashboard()
  const { generateSchedule, isGenerating } = useSchedules()
  const [isGeneratingSchedule, setIsGeneratingSchedule] = useState(false)
  const [scheduleError, setScheduleError] = useState<string | null>(null)

  const handleGenerateSchedule = async () => {
    setIsGeneratingSchedule(true)
    setScheduleError(null)
    try {
      const nextSaturday = new Date()
      nextSaturday.setDate(nextSaturday.getDate() + ((6 - nextSaturday.getDay()) % 7))
      const dateStr = nextSaturday.toISOString().split('T')[0]

      await generateSchedule({
        date: dateStr,
        run_async: true,
      })
    } catch (error: any) {
      setScheduleError(error.message || 'Failed to generate schedule')
    } finally {
      setIsGeneratingSchedule(false)
    }
  }

  const healthStatus = getHealthStatus()
  const isOkay = isEverythingOkay()
  const mostUrgentAlert = getMostUrgentAlert()

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64 w-full">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                {isOkay ? 'Everything looks good' : `Health Status: ${healthStatus.toUpperCase()}`}
              </p>
            </div>
            <button
              onClick={refreshDashboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Summary Cards - Answer: Are we okay this week? */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {isLoading ? (
              <>
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
                <LoadingCard />
              </>
            ) : (
              <>
                {/* Do we have enough people? */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
                  <p className="text-3xl font-bold mt-2">{summary?.total_members || 0}</p>
                  <p className="text-xs text-gray-500 mt-2">Active in system</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Available This Week</h3>
                  <p className="text-3xl font-bold mt-2 text-green-600">
                    {summary?.available_this_week || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Ready for assignment</p>
                </div>

                {/* Is scheduling done? */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Unassigned Roles</h3>
                  <p className={`text-3xl font-bold mt-2 ${(summary?.unassigned_roles ?? 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {summary?.unassigned_roles || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Need attention</p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Active Schedules</h3>
                  <p className="text-3xl font-bold mt-2 text-blue-600">{summary?.active_schedules || 0}</p>
                  <p className="text-xs text-gray-500 mt-2">In progress</p>
                </div>

                {/* Fairness Score */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Fairness Score</h3>
                  <p className={`text-3xl font-bold mt-2 ${(summary?.fairness_score ?? 0) >= 75 ? 'text-green-600' : 'text-yellow-600'}`}>
                    {Math.round(summary?.fairness_score || 0)}%
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Organization-wide</p>
                </div>

                {/* Burnout Risk Indicator */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-600">Burnout Risk</h3>
                  <p className={`text-3xl font-bold mt-2 ${(summary?.burnout_risk_count ?? 0) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {summary?.burnout_risk_count || 0}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Members at risk</p>
                </div>
              </>
            )}
          </div>

          {/* Generate Schedule Button - VERY IMPORTANT */}
          <div className="mb-8">
            <button
              onClick={handleGenerateSchedule}
              disabled={isGeneratingSchedule}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition ${
                isGeneratingSchedule
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isGeneratingSchedule ? 'Generating Schedule...' : 'Generate Schedule'}
            </button>
            {scheduleError && (
              <p className="mt-2 text-red-600 text-sm">{scheduleError}</p>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Alerts Panel - Any problems? */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Alerts</h2>
                {!isLoading && summary && summary.alerts.length === 0 ? (
                  <p className="text-green-600 font-medium">All clear!</p>
                ) : (
                  <div className="space-y-3">
                    {summary?.alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded ${
                          alert.type === 'error'
                            ? 'bg-red-50 border border-red-200'
                            : alert.type === 'warning'
                              ? 'bg-yellow-50 border border-yellow-200'
                              : 'bg-blue-50 border border-blue-200'
                        }`}
                      >
                        <p className={`text-sm font-medium ${
                          alert.type === 'error'
                            ? 'text-red-800'
                            : alert.type === 'warning'
                              ? 'text-yellow-800'
                              : 'text-blue-800'
                        }`}>
                          {alert.message}
                        </p>
                      </div>
                    ))}
                    {summary && summary.alerts.length > 3 && (
                      <p className="text-sm text-gray-600 pt-2">
                        +{summary.alerts.length - 3} more alerts
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Schedule Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Upcoming Schedule</h2>
                {summary?.upcoming_schedule ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-3">
                      Next Saturday: {new Date(summary.upcoming_schedule.date).toLocaleDateString()}
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-sm">Assignments</span>
                        <span className="font-semibold">{summary.upcoming_schedule.assignment_count}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm">Unfilled Roles</span>
                        <span className={`font-semibold ${summary.upcoming_schedule.unfilled_roles > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {summary.upcoming_schedule.unfilled_roles}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm">No upcoming schedule</p>
                )}
              </div>
            </div>

            {/* Insight Box */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow p-6 border border-blue-100">
                <h2 className="text-lg font-semibold mb-4 text-blue-900">Weekly Insight</h2>
                <p className="text-blue-800 text-sm leading-relaxed">
                  {summary?.insight || 'System is operating normally. All metrics are within expected ranges.'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/members"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
            >
              <p className="text-2xl mb-2">👥</p>
              <h3 className="font-semibold">Manage Members</h3>
              <p className="text-sm text-gray-600 mt-1">View and manage team</p>
            </Link>
            <Link
              href="/availability"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
            >
              <p className="text-2xl mb-2">📅</p>
              <h3 className="font-semibold">Check Availability</h3>
              <p className="text-sm text-gray-600 mt-1">Weekly submission status</p>
            </Link>
            <Link
              href="/schedules"
              className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition text-center"
            >
              <p className="text-2xl mb-2">📊</p>
              <h3 className="font-semibold">View Schedules</h3>
              <p className="text-sm text-gray-600 mt-1">Review and manage</p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
