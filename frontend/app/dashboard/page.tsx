'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'

export default function DashboardPage() {
  const [metrics] = useState({
    totalMembers: 156,
    activeMembers: 142,
    averageFairness: 87,
    upcomingSchedules: 3,
    burnoutAlerts: 2,
  })

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64 w-full">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">📊 Dashboard</h1>
            <Link href="/settings" className="btn-secondary">
              Settings
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
            <p className="text-2xl font-bold mt-2">{metrics.totalMembers}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Active</h3>
            <p className="text-2xl font-bold mt-2 text-green-600">{metrics.activeMembers}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Fairness Score</h3>
            <p className="text-2xl font-bold mt-2 text-blue-600">{metrics.averageFairness}%</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
            <p className="text-2xl font-bold mt-2 text-purple-600">{metrics.upcomingSchedules}</p>
          </div>
          <div className="card">
            <h3 className="text-sm font-medium text-gray-500">Alerts</h3>
            <p className="text-2xl font-bold mt-2 text-red-600">{metrics.burnoutAlerts}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link href="/schedules" className="w-full btn-primary block text-center">
                Generate New Schedule
              </Link>
              <Link href="/members" className="w-full btn-secondary block text-center">
                View Members
              </Link>
              <Link href="/availability" className="w-full btn-secondary block text-center">
                Check Availability
              </Link>
            </div>
          </div>
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <span>Schedule published for Dec 15</span>
                <span className="text-sm text-gray-500">2h ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span>5 members submitted availability</span>
                <span className="text-sm text-gray-500">5h ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Fairness metrics updated</span>
                <span className="text-sm text-gray-500">1d ago</span>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
