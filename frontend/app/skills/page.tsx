'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function SkillsPage() {
  const [skills, setSkills] = useState([
    { id: 1, name: 'Medical Assistance', description: 'Basic medical support and assistance', members: 12 },
    { id: 2, name: 'Teaching', description: 'Educational support and instruction', members: 8 },
    { id: 3, name: 'Counseling', description: 'Emotional support and guidance', members: 5 },
    { id: 4, name: 'Administration', description: 'Administrative and office work', members: 15 },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Skills Management" description="Manage and organize organizational skills" />
        
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{skill.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{skill.members} members</span>
                  <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-medium hover:bg-blue-200">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            + Add New Skill
          </button>
        </div>
      </main>
    </div>
  )
}
