'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useAvailability } from '@/hooks/useAvailability'
import { useMembers } from '@/hooks/useMembers'

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function AvailabilityPage() {
  const { availabilities, isLoading, submitAvailability, autoFillFromLastWeek, getAvailabilityPercentage } =
    useAvailability()
  const { members } = useMembers()
  const [weekStart, setWeekStart] = useState(new Date().toISOString().split('T')[0])
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null)
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleDayToggle = (day: string) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    )
  }

  const handleSubmitAvailability = async () => {
    if (!selectedMemberId || selectedDays.length === 0) return

    setIsSubmitting(true)
    try {
      await submitAvailability({
        member_id: selectedMemberId,
        week_start: weekStart,
        available_days: selectedDays,
      })
      setSelectedDays([])
      setSelectedMemberId(null)
    } catch (error) {
      console.error('Failed to submit availability:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const submittedMemberIds = new Set(availabilities?.map((a) => a.member.id) || [])
  const pendingMembers = members.filter((m) => !submittedMemberIds.has(m.id))
  const submissionRate = availabilities && members.length > 0
    ? Math.round((availabilities.length / members.length) * 100)
    : 0

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header
          title="Availability Tracking"
          description="Collect weekly availability submissions from members"
        />

        <div className="p-8">
          {/* Submission Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Total Members</h3>
              <p className="text-3xl font-bold mt-2">{members.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Submitted</h3>
              <p className="text-3xl font-bold mt-2 text-green-600">{availabilities?.length || 0}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-600">Submission Rate</h3>
              <p className="text-3xl font-bold mt-2 text-blue-600">{submissionRate}%</p>
            </div>
          </div>

          {/* Pending Submissions Warning */}
          {pendingMembers.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
              <p className="font-semibold">{pendingMembers.length} members haven't submitted availability</p>
            </div>
          )}

          {/* Availability Form */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-lg font-semibold mb-6">Submit Weekly Availability</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Member</label>
                <select
                  value={selectedMemberId || ''}
                  onChange={(e) => {
                    setSelectedMemberId(e.target.value)
                    setSelectedDays([])
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a member --</option>
                  {pendingMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.first_name} {member.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMemberId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Available Days
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {DAYS_OF_WEEK.map((day) => (
                        <label key={day} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedDays.includes(day)}
                            onChange={() => handleDayToggle(day)}
                            className="w-4 h-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">{day}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitAvailability}
                    disabled={isSubmitting || selectedDays.length === 0}
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                      isSubmitting || selectedDays.length === 0
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Availability'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Submitted Availabilities */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Submitted Availabilities</h2>
            {isLoading ? (
              <p className="text-gray-600">Loading...</p>
            ) : availabilities && availabilities.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Member</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Available Days</th>
                      <th className="px-4 py-2 text-left text-sm font-semibold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilities.map((avail) => (
                      <tr key={avail.id} className="border-b">
                        <td className="px-4 py-3 text-sm font-medium">
                          {avail.member.first_name} {avail.member.last_name}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {avail.available_days.map((day) => (
                              <span key={day} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                                {day}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(avail.submitted_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No availabilities submitted yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
