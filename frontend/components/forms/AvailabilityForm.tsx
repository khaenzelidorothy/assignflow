'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface AvailabilityFormProps {
  memberId?: string
  onSubmit: (data: any) => void
}

export function AvailabilityForm({ memberId, onSubmit }: AvailabilityFormProps) {
  const [status, setStatus] = useState<'available' | 'unavailable'>('available')
  const [selectedDates, setSelectedDates] = useState<string[]>([])
  const [notes, setNotes] = useState('')

  const nextTwoWeeks = Array.from({ length: 14 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
    }
  })

  const toggleDate = (date: string) => {
    setSelectedDates(prev => 
      prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ member_id: memberId, dates: selectedDates, status, notes })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability Status
        </label>
        <div className="flex gap-3">
          <Button
            type="button"
            variant={status === 'available' ? 'primary' : 'secondary'}
            onClick={() => setStatus('available')}
          >
            ✅ Available
          </Button>
          <Button
            type="button"
            variant={status === 'unavailable' ? 'primary' : 'secondary'}
            onClick={() => setStatus('unavailable')}
          >
            ❌ Unavailable
          </Button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Dates (Next 2 Weeks)
        </label>
        <div className="grid grid-cols-7 gap-2">
          {nextTwoWeeks.map(({ date, day, dayNum }) => (
            <button
              key={date}
              type="button"
              onClick={() => toggleDate(date)}
              className={`p-2 rounded-lg text-center text-xs transition-all ${
                selectedDates.includes(date)
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-500 font-medium'
                  : 'bg-gray-50 text-gray-700 border-2 border-transparent hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{day}</div>
              <div className="text-lg">{dayNum}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="Any additional information..."
        />
      </div>

      <Button type="submit" className="w-full" size="lg">
        Submit Availability
      </Button>
    </form>
  )
}
