'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useSchedules } from '@/hooks/useSchedules'

function getStatusColor(status: string) {
  switch (status) {
    case 'draft':
      return 'bg-gray-100 text-gray-800'
    case 'pending_review':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-blue-100 text-blue-800'
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'locked':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function SchedulesPage() {
  const {
    schedules,
    isLoading,
    error,
    taskStatus,
    generateSchedule,
    publishSchedule,
    lockSchedule,
  } = useSchedules()

  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null)

  const handlePublishSchedule = async (scheduleId: string) => {
    try {
      await publishSchedule(scheduleId)
    } catch (error) {
      console.error('Failed to publish schedule:', error)
    }
  }

  const handleLockSchedule = async (scheduleId: string) => {
    try {
      await lockSchedule(scheduleId)
    } catch (error) {
      console.error('Failed to lock schedule:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header
          title="Schedule Management"
          description="View, manage, and publish generated schedules"
        />

        <div className="p-8">
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Task Status */}
          {taskStatus && taskStatus.status === 'processing' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
              <p className="font-semibold">Schedule generation in progress...</p>
              <p className="text-sm mt-1">Task ID: {taskStatus.task_id}</p>
            </div>
          )}

          {taskStatus && taskStatus.status === 'failed' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <p className="font-semibold">Schedule generation failed</p>
              <p className="text-sm mt-1">{taskStatus.error}</p>
            </div>
          )}

          {/* Schedules List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-gray-600">Loading schedules...</div>
            ) : schedules.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-600 mb-4">
                  No schedules yet. Generate one from the Dashboard to get started.
                </p>
                <Link href="/dashboard" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              schedules.map((schedule) => (
                <div key={schedule.id} className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b hover:bg-gray-50 cursor-pointer transition"
                    onClick={() => setExpandedSchedule(expandedSchedule === schedule.id ? null : schedule.id)}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{schedule.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Date: {new Date(schedule.date).toLocaleDateString()} (v{schedule.version})
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(schedule.status)}`}
                        >
                          {schedule.status.replace('_', ' ').charAt(0).toUpperCase() +
                            schedule.status.replace('_', ' ').slice(1)}
                        </span>
                        <span className="text-sm text-gray-600">{schedule.assignment_count || schedule.assignments.length} assignments</span>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedSchedule === schedule.id && (
                    <div className="p-6 border-t bg-gray-50">
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Assignments by Role</h4>
                        <div className="space-y-2">
                          {schedule.assignments && schedule.assignments.length > 0 ? (
                            schedule.assignments.map((assignment, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-white rounded border">
                                <div>
                                  <p className="font-medium text-gray-900">{assignment.role.name}</p>
                                  <p className="text-sm text-gray-600">{assignment.member.first_name} {assignment.member.last_name}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">
                                    {assignment.auto_generated ? 'Auto-generated' : 'Manual'}
                                  </p>
                                  {assignment.score && (
                                    <p className="text-xs text-gray-500">Score: {assignment.score.toFixed(2)}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-600 text-sm">No assignments</p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {schedule.status === 'draft' && (
                          <>
                            <button
                              onClick={() => handlePublishSchedule(schedule.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Approve
                            </button>
                            <button
                              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg cursor-not-allowed"
                              disabled
                            >
                              Lock
                            </button>
                          </>
                        )}

                        {schedule.status === 'approved' && (
                          <button
                            onClick={() => handleLockSchedule(schedule.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                          >
                            Publish
                          </button>
                        )}

                        {schedule.status === 'published' && (
                          <button
                            onClick={() => handleLockSchedule(schedule.id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Lock
                          </button>
                        )}

                        {schedule.status === 'locked' && (
                          <p className="text-sm text-gray-600">Schedule is locked and cannot be modified</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
