interface Activity {
  id: string
  action: string
  description: string
  timestamp: string
  type: 'schedule' | 'member' | 'availability' | 'system' | 'alert'
}

interface RecentActivityProps {
  activities?: Activity[]
}

const typeStyles = {
  schedule: { icon: '📅', bg: 'bg-blue-100' },
  member: { icon: '👤', bg: 'bg-green-100' },
  availability: { icon: '✅', bg: 'bg-purple-100' },
  system: { icon: '⚙️', bg: 'bg-gray-100' },
  alert: { icon: '⚠️', bg: 'bg-red-100' },
}

export function RecentActivity({ activities = [] }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No recent activity</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {activities.slice(0, 5).map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className={`w-8 h-8 ${typeStyles[activity.type].bg} rounded-full flex items-center justify-center flex-shrink-0`}>
            <span className="text-sm">{typeStyles[activity.type].icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
            <p className="text-sm text-gray-500 truncate">{activity.description}</p>
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{activity.timestamp}</span>
        </div>
      ))}
    </div>
  )
}
