'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'
import { useSkills } from '@/hooks/useSkills'
import AddSkillModal from '@/components/skills/AddSkillModal'

function getScarcityColor(level: string) {
  switch (level) {
    case 'red':
      return 'bg-red-50 border border-red-200'
    case 'yellow':
      return 'bg-yellow-50 border border-yellow-200'
    case 'green':
      return 'bg-green-50 border border-green-200'
    default:
      return 'bg-gray-50 border border-gray-200'
  }
}

function getScarcityBadgeColor(level: string) {
  switch (level) {
    case 'red':
      return 'bg-red-100 text-red-800'
    case 'yellow':
      return 'bg-yellow-100 text-yellow-800'
    case 'green':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export default function SkillsPage() {
  const { skills, isLoading, error, createSkill, deleteSkill, getSkillScarcity } = useSkills()
  const [showAddModal, setShowAddModal] = useState(false)

  const handleAddSkill = async (data: any) => {
    try {
      await createSkill(data)
      setShowAddModal(false)
    } catch (error) {
      console.error('Failed to create skill:', error)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await deleteSkill(skillId)
      } catch (error) {
        console.error('Failed to delete skill:', error)
      }
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Skills Management" description="Define capabilities and skill assignments" />

        <div className="p-8">
          {/* Add Skill Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Add Skill
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                Loading skills...
              </div>
            ) : skills.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-600">
                No skills yet. Click "Add Skill" to create your first skill.
              </div>
            ) : (
              skills.map((skill) => {
                const scarcityLevel = getSkillScarcity(skill)
                return (
                  <div
                    key={skill.id}
                    className={`rounded-lg shadow p-6 ${getScarcityColor(scarcityLevel)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getScarcityBadgeColor(scarcityLevel)}`}>
                        {scarcityLevel === 'red'
                          ? 'Scarce'
                          : scarcityLevel === 'yellow'
                            ? 'Moderate'
                            : 'Well-staffed'}
                      </span>
                    </div>

                    {skill.description && (
                      <p className="text-gray-700 text-sm mb-4">{skill.description}</p>
                    )}

                    {skill.category && (
                      <p className="text-xs text-gray-600 mb-3">Category: {skill.category}</p>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {skill.member_count || 0} members
                      </span>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Skill Scarcity Legend */}
          {!isLoading && skills.length > 0 && (
            <div className="mt-8 p-4 bg-white rounded-lg shadow">
              <h3 className="font-semibold text-gray-900 mb-3">Skill Scarcity Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-500 rounded"></span>
                  <span className="text-sm text-gray-700">Scarce: Less than 3 people</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-500 rounded"></span>
                  <span className="text-sm text-gray-700">Moderate: 3-8 people</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-500 rounded"></span>
                  <span className="text-sm text-gray-700">Well-staffed: 8+ people</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal */}
        {showAddModal && (
          <AddSkillModal onClose={() => setShowAddModal(false)} onSubmit={handleAddSkill} />
        )}
      </main>
    </div>
  )
}
