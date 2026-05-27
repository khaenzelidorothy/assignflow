'use client'

import { Table, THead, TBody, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface Schedule {
  id: string
  name: string
  date: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'locked'
  assignmentCount: number
  filledCount: number
}

interface SchedulesTableProps {
  schedules: Schedule[]
  onView?: (schedule: Schedule) => void
  onPublish?: (schedule: Schedule) => void
  onEdit?: (schedule: Schedule) => void
  isLoading?: boolean
}

const statusConfig: Record<string, { label: string; variant: 'default' | 'warning' | 'info' | 'success' | 'error' }> = {
  draft: { label: 'Draft', variant: 'default' },
  pending_review: { label: 'Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'info' },
  published: { label: 'Published', variant: 'success' },
  locked: { label: 'Locked', variant: 'error' },
}

export function SchedulesTable({ schedules, onView, onPublish, onEdit, isLoading }: SchedulesTableProps) {
  if (isLoading) return <div className="text-center py-8 text-gray-500">Loading schedules...</div>
  
  if (schedules.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <span className="text-4xl block mb-2">📅</span>
        <p className="text-gray-500">No schedules found</p>
      </div>
    )
  }

  return (
    <Table>
      <THead>
        <Tr>
          <Th>Name</Th>
          <Th>Date</Th>
          <Th>Status</Th>
          <Th>Progress</Th>
          <Th>Actions</Th>
        </Tr>
      </THead>
      <TBody>
        {schedules.map((schedule) => {
          const status = statusConfig[schedule.status]
          const progress = schedule.assignmentCount > 0
            ? Math.round((schedule.filledCount / schedule.assignmentCount) * 100)
            : 0

          return (
            <Tr key={schedule.id}>
              <Td className="font-medium">{schedule.name}</Td>
              <Td className="text-gray-500">
                {new Date(schedule.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Td>
              <Td>
                <Badge variant={status.variant}>{status.label}</Badge>
              </Td>
              <Td>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{progress}%</span>
                </div>
              </Td>
              <Td>
                <div className="flex gap-2">
                  {onView && (
                    <Button size="sm" variant="ghost" onClick={() => onView(schedule)}>👁️</Button>
                  )}
                  {onEdit && (
                    <Button size="sm" variant="ghost" onClick={() => onEdit(schedule)}>✏️</Button>
                  )}
                  {onPublish && schedule.status === 'approved' && (
                    <Button size="sm" variant="primary" onClick={() => onPublish(schedule)}>
                      Publish
                    </Button>
                  )}
                </div>
              </Td>
            </Tr>
          )
        })}
      </TBody>
    </Table>
  )
}
