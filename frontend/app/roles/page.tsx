'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useRoles } from '@/hooks/useRoles'
import { useSkills } from '@/hooks/useSkills'
import AddRoleModal from '@/components/roles/AddRoleModal'

function getPriorityColor(priority: number) {
  if (priority <= 3) return 'bg-green-100 text-green-800'
  if (priority <= 6) return 'bg-yellow-100 text-yellow-800'
  return 'bg-red-100 text-red-800'
}

function getPriorityLabel(priority: number) {
  if (priority <= 3) return 'Low'
  if (priority <= 6) return 'Medium'
  return 'High'
}

export default function RolesPage() {
  const { roles, isLoading, error, createRole, deleteRole, calculateDifficulty, getStaffingStatus } = useRoles()
  const { skills } = useSkills()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddRole = async (data: any) => {
    try {
      await createRole(data)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create role:', error)
    }
  }

  const handleDeleteRole = async (roleId: string) => {
    if (confirm('Are you sure you want to delete this role?')) {
      try {
        await deleteRole(roleId)
      } catch (error) {
        console.error('Failed to delete role:', error)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Roles Management" description="Define work areas and role requirements" />

        <div className="p-8">
          {/* Add Role Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Role
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Roles Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-600">Loading roles...</div>
            ) : roles.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No roles yet. Click "Add Role" to create your first role.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Required Skill</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">People Needed</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Priority</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Difficulty</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => {
                      const difficulty = calculateDifficulty(role)
                      const staffingStatus = getStaffingStatus(role)
                      const currentCount = role.current_assignments || 0

                      return (
                        <tr key={role.id} className="border-b hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {role.required_skill ? role.required_skill.name : 'None'}
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold">{role.required_people_count}</td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded ${
                                currentCount >= role.required_people_count
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {currentCount}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                staffingStatus === 'filled'
                                  ? 'bg-green-100 text-green-800'
                                  : staffingStatus === 'partial'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {staffingStatus.charAt(0).toUpperCase() + staffingStatus.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(role.priority)}`}>
                              {getPriorityLabel(role.priority)} ({role.priority})
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${Math.min(difficulty * 10, 100)}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-semibold text-gray-700">{difficulty}/10</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleDeleteRole(role.id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showAddModal && (
          <AddRoleModal
            skills={skills}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddRole}
          />
        )}
      </main>
    </div>
  )
}
