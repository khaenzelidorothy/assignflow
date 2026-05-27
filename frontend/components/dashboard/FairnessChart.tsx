interface FairnessData {
  name: string
  score: number
}

interface FairnessChartProps {
  data?: FairnessData[]
  title?: string
}

export function FairnessChart({ data = [], title = 'Fairness Scores' }: FairnessChartProps) {
  const getColor = (score: number) => {
    if (score >= 80) return 'bg-green-500'
    if (score >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div>
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No data available</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span>{item.name}</span>
                <span className="font-medium">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full transition-all duration-500 ${getColor(item.score)}`}
                  style={{ width: `${Math.min(100, item.score)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
