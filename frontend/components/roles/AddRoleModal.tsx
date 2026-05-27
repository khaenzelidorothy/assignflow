'use client'

import { useState } from 'react'

interface AddRoleModalProps {
  skills: any[]
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

export default function AddRoleModal({ skills, onClose, onSubmit }: AddRoleModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    required_skill: '',
    required_people_count: 1,
    priority: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    const numValue = ['required_people_count', 'priority'].includes(name) ? parseInt(value) : value
    setFormData((prev) => ({ ...prev, [name]: numValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!formData.name.trim()) {
      setError('Role name is required')
      setIsSubmitting(false)
      return
    }

    if (formData.required_people_count < 1) {
      setError('At least 1 person is required')
      setIsSubmitting(false)
      return
    }

    try {
      await onSubmit(formData)
    } catch (err: any) {
      setError(err.message || 'Failed to add role')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Add New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Cleaning Team Lead, Nurse, Security"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="What are the responsibilities and constraints?"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skill</label>
            <select
              name="required_skill"
              value={formData.required_skill}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a skill --</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                People Needed *
              </label>
              <input
                type="number"
                name="required_people_count"
                min="1"
                max="100"
                value={formData.required_people_count}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority (1-10)</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  name="priority"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <span className="text-lg font-semibold text-gray-700 min-w-[40px]">
                  {formData.priority}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Higher priority = assigned first</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white transition ${
                isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isSubmitting ? 'Adding...' : 'Add Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
