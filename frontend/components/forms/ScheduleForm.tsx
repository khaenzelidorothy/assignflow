'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ScheduleFormProps {
  onSubmit: (data: any) => void
  isLoading?: boolean
}

export function ScheduleForm({ onSubmit, isLoading }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    fairnessWeight: 80,
    prioritizeScarcity: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Schedule Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="e.g., Sunday Service Schedule"
        required
      />
      
      <Input
        label="Schedule Date"
        type="date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Fairness Weight: {formData.fairnessWeight}%
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.fairnessWeight}
          onChange={(e) => setFormData({ ...formData, fairnessWeight: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="scarcity"
          checked={formData.prioritizeScarcity}
          onChange={(e) => setFormData({ ...formData, prioritizeScarcity: e.target.checked })}
          className="rounded border-gray-300"
        />
        <label htmlFor="scarcity" className="text-sm text-gray-700">
          Prioritize hard-to-fill roles first
        </label>
      </div>

      <div className="flex gap-3">
        <Button type="submit" isLoading={isLoading}>
          Generate Schedule
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  )
}
