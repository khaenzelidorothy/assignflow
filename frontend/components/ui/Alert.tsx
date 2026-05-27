interface AlertProps {
  children: React.ReactNode
  variant?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  className?: string
  onClose?: () => void
}

const variants = {
  info: {
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    icon: 'ℹ️',
  },
  success: {
    bg: 'bg-green-50 border-green-200',
    text: 'text-green-800',
    icon: '✅',
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    text: 'text-yellow-800',
    icon: '⚠️',
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    text: 'text-red-800',
    icon: '❌',
  },
}

export function Alert({ children, variant = 'info', title, className = '', onClose }: AlertProps) {
  const style = variants[variant]

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${style.bg} ${style.text} ${className}`}>
      <span className="text-lg flex-shrink-0">{style.icon}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-current opacity-50 hover:opacity-100 flex-shrink-0">
          ✕
        </button>
      )}
    </div>
  )
}
