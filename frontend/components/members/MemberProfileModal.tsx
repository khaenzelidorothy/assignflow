'use client'

interface MemberProfileModalProps {
  member: any
  onClose: () => void
}

export default function MemberProfileModal({ member, onClose }: MemberProfileModalProps) {
  const fairnessProfile = member.fairness_profile

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Member Profile</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-lg font-medium">
                  {member.first_name} {member.last_name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-medium">{member.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="text-lg font-medium">{member.phone_number || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : member.status === 'on_leave'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Skills</h3>
            {member.member_skills && member.member_skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {member.member_skills.map((ms: any) => (
                  <div key={ms.id} className="px-3 py-2 bg-blue-100 text-blue-800 rounded">
                    <p className="font-medium">{ms.skill.name}</p>
                    <p className="text-xs">
                      Level:{' '}
                      {
                        ['Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'][
                          ms.proficiency_level - 1
                        ]
                      }
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No skills assigned</p>
            )}
          </div>

          {/* Fairness Metrics */}
          {fairnessProfile && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Fairness Score</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {Math.round(fairnessProfile.fairness_score)}%
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Assignments</p>
                  <p className="text-3xl font-bold text-green-600">
                    {fairnessProfile.total_assignments}
                  </p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Burnout Score</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {Math.round(fairnessProfile.burnout_score)}%
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Workload Score</p>
                  <p className="text-3xl font-bold text-red-600">
                    {Math.round(fairnessProfile.workload_score)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <strong>Consecutive Weeks:</strong> {fairnessProfile.consecutive_weeks_assigned}
                </p>
                {fairnessProfile.last_assignment_date && (
                  <p className="text-sm">
                    <strong>Last Assignment:</strong>{' '}
                    {new Date(fairnessProfile.last_assignment_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Assignment History Note */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Assignment History:</strong> All historical assignments are preserved for
              fairness calculations and auditing purposes.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
