interface PieData {
  label: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieData[]
  title?: string
  size?: number
}

export function PieChart({ data, title, size = 150 }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  if (total === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No data to display</p>
      </div>
    )
  }

  return (
    <div>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">{title}</h4>}
      <div className="flex flex-col items-center gap-4">
        <div
          className="relative rounded-full"
          style={{ width: size, height: size }}
        >
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const previousPercentages = data
                .slice(0, index)
                .reduce((sum, d) => sum + (d.value / total) * 100, 0)
              
              const dashArray = `${percentage} ${100 - percentage}`
              const dashOffset = -previousPercentages

              return (
                <circle
                  key={index}
                  cx="18"
                  cy="18"
                  r="15.9"
                  fill="none"
                  stroke={item.color}
                  strokeWidth="3.5"
                  strokeDasharray={dashArray}
                  strokeDashoffset={dashOffset}
                  className="transition-all duration-500"
                />
              )
            })}
          </svg>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-gray-600">
                {item.label} ({Math.round((item.value / total) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
