'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface MemberFormProps {
  onSubmit: (data: any) => void
  initialData?: any
  isLoading?: boolean
}

export function MemberForm({ onSubmit, initialData, isLoading }: MemberFormProps) {
  const [formData, setFormData] = useState({
    first_name: initialData?.first_name || '',
    last_name: initialData?.last_name || '',
    email: initialData?.email || '',
    phone_number: initialData?.phone_number || '',
    status: initialData?.status || 'active',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={formData.first_name}
          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
          placeholder="John"
          required
        />
        <Input
          label="Last Name"
          value={formData.last_name}
          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
          placeholder="Doe"
          required
        />
      </div>
      
      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="john@example.com"
        required
      />
      
      <Input
        label="Phone Number"
        type="tel"
        value={formData.phone_number}
        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
        placeholder="+1 234 567 8900"
      />

      <Select
        label="Status"
        value={formData.status}
        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'on_leave', label: 'On Leave' },
        ]}
      />

      <div className="flex gap-3 pt-2">
        <Button type="submit" isLoading={isLoading}>
          {initialData ? 'Update Member' : 'Add Member'}
        </Button>
        <Button type="button" variant="secondary">
          Cancel
        </Button>
      </div>
    </form>
  )
}
