interface BarData {
  label: string
  value: number
  color?: string
}

interface SimpleBarChartProps {
  data: BarData[]
  title?: string
  height?: number
  showValues?: boolean
}

export function SimpleBarChart({ data, title, height = 200, showValues = true }: SimpleBarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)

  return (
    <div>
      {title && <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>}
      <div className="flex items-end gap-2" style={{ height: `${height}px` }}>
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            {showValues && (
              <span className="text-xs font-medium text-gray-600">{item.value}</span>
            )}
            <div
              className="w-full rounded-t-md transition-all duration-500 hover:opacity-80"
              style={{
                height: `${(item.value / maxValue) * 100}%`,
                backgroundColor: item.color || '#3B82F6',
                minHeight: '4px',
              }}
            />
            <span className="text-xs text-gray-500 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
