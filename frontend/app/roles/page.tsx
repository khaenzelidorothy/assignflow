'use client'

import { useState } from 'react'
import { Navigation } from '@/components/layout/Navigation'
import { Header } from '@/components/layout/Header'

export default function RolesPage() {
  const [roles, setRoles] = useState([
    { id: 1, name: 'Lead Counselor', skill: 'Counseling', required: 2, filled: 2, priority: 'High' },
    { id: 2, name: 'Medical Attendant', skill: 'Medical Assistance', required: 3, filled: 2, priority: 'High' },
    { id: 3, name: 'Instructor', skill: 'Teaching', required: 1, filled: 1, priority: 'Medium' },
    { id: 4, name: 'Office Manager', skill: 'Administration', required: 1, filled: 1, priority: 'Low' },
  ])

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex-1 lg:ml-64">
        <Header title="Roles Management" description="Configure roles and requirements" />
        
        <div className="p-8">
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Skill Required</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Required</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Filled</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{role.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.skill}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.required}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{role.filled}/{role.required}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        role.priority === 'High' ? 'bg-red-100 text-red-700' : 
                        role.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {role.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="mt-8 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            + Add New Role
          </button>
        </div>
      </main>
    </div>
  )
}
