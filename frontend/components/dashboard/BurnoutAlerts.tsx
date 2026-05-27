import { Badge } from '@/components/ui/Badge'

interface BurnoutMember {
  id: string
  name: string
  burnoutScore: number
  lastAssigned: string
  workloadScore: number
}

interface BurnoutAlertsProps {
  members?: BurnoutMember[]
}

export function BurnoutAlerts({ members = [] }: BurnoutAlertsProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-8">
        <span className="text-4xl block mb-2">🎉</span>
        <p className="text-gray-500">No burnout risks detected!</p>
        <p className="text-sm text-gray-400 mt-1">All members have healthy workloads</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="flex-1">
            <p className="font-medium text-gray-900">{member.name}</p>
            <p className="text-xs text-gray-500">Last assigned: {member.lastAssigned}</p>
          </div>
          <div className="text-right">
            <Badge variant={member.burnoutScore > 80 ? 'error' : 'warning'}>
              {Math.round(member.burnoutScore)}% Risk
            </Badge>
            <p className="text-xs text-gray-500 mt-1">Workload: {Math.round(member.workloadScore)}%</p>
          </div>
        </div>
      ))}
    </div>
  )
}
