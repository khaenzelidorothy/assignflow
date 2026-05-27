import { Badge } from '@/components/ui/Badge'

interface Schedule {
  id: string
  name: string
  date: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'locked'
  filledRoles: number
  totalRoles: number
}

interface ScheduleStatusProps {
  schedules?: Schedule[]
}

const statusConfig = {
  draft: { label: 'Draft', variant: 'default' as const },
  pending_review: { label: 'Review', variant: 'warning' as const },
  approved: { label: 'Approved', variant: 'info' as const },
  published: { label: 'Published', variant: 'success' as const },
  locked: { label: 'Locked', variant: 'error' as const },
}

export function ScheduleStatus({ schedules = [] }: ScheduleStatusProps) {
  if (schedules.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No schedules found</p>
        <p className="text-sm text-gray-400 mt-1">Create your first schedule to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {schedules.map((schedule) => {
        const status = statusConfig[schedule.status]
        const progress = schedule.totalRoles > 0 
          ? Math.round((schedule.filledRoles / schedule.totalRoles) * 100) 
          : 0

        return (
          <div key={schedule.id} className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-gray-900">{schedule.name}</p>
                <p className="text-sm text-gray-500">{schedule.date}</p>
              </div>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {schedule.filledRoles}/{schedule.totalRoles} roles filled ({progress}%)
            </p>
          </div>
        )
      })}
    </div>
  )
}
