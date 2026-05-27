'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useMembers } from '@/hooks/useMembers'
import { useSkills } from '@/hooks/useSkills'
import MembersList from '@/components/members/MembersList'
import AddMemberModal from '@/components/members/AddMemberModal'
import MemberProfileModal from '@/components/members/MemberProfileModal'

export default function MembersPage() {
  const { members, isLoading, error, createMember, updateMember, deleteMember } = useMembers()
  const { skills } = useSkills()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleAddMember = async (data: any) => {
    try {
      await createMember(data)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create member:', error)
    }
  }

  const handleEditMember = async (memberId: string, data: any) => {
    try {
      await updateMember(memberId, data)
    } catch (error) {
      console.error('Failed to update member:', error)
    }
  }

  const handleDeleteMember = async (memberId: string) => {
    if (confirm('Are you sure you want to deactivate this member?')) {
      try {
        await deleteMember(memberId)
      } catch (error) {
        console.error('Failed to delete member:', error)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header
          title="Members Management"
          description="View, add, and manage your team members"
        />

        <div className="p-8">
          {/* Add Member Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Member
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Members Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-600">Loading members...</div>
            ) : members.length === 0 ? (
              <div className="p-8 text-center text-gray-600">
                No members yet. Click "Add Member" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Skills</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Fairness Score</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member) => (
                      <tr key={member.id} className="border-b hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm font-medium">{member.full_name || `${member.first_name} ${member.last_name}`}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.email}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{member.phone_number || '—'}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex flex-wrap gap-2">
                            {member.member_skills && member.member_skills.length > 0 ? (
                              member.member_skills.slice(0, 2).map((ms: any) => (
                                <span
                                  key={ms.id}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                                >
                                  {ms.skill.name}
                                </span>
                              ))
                            ) : (
                              <span className="text-gray-400">No skills</span>
                            )}
                            {member.member_skills && member.member_skills.length > 2 && (
                              <span className="text-xs text-gray-500">
                                +{member.member_skills.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              member.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : member.status === 'on_leave'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {member.fairness_profile ? (
                            <span className="font-semibold">
                              {Math.round(member.fairness_profile.fairness_score)}%
                            </span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm space-x-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member)
                              setShowProfileModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Deactivate
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddMemberModal
            skills={skills}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddMember}
          />
        )}

        {showProfileModal && selectedMember && (
          <MemberProfileModal
            member={selectedMember}
            onClose={() => {
              setShowProfileModal(false)
              setSelectedMember(null)
            }}
          />
        )}
      </main>
    </div>
  )
}
