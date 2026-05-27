import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'

interface Metric {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: string
  color?: string
}

interface MetricsGridProps {
  metrics: Metric[]
  isLoading?: boolean
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} hoverable>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">{metric.title}</span>
            {metric.icon && <span className="text-xl">{metric.icon}</span>}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
            {metric.change && (
              <span className={`text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : ''} {metric.change}
              </span>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
