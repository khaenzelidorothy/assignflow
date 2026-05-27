interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function THead({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <thead className={`bg-gray-50 ${className}`}>{children}</thead>
}

export function TBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <tbody className={`divide-y divide-gray-200 bg-white ${className}`}>{children}</tbody>
}

export function Th({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>
      {children}
    </th>
  )
}

export function Td({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-900 ${className}`}>
      {children}
    </td>
  )
}

export function Tr({ children, className = '', onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr className={`hover:bg-gray-50 ${onClick ? 'cursor-pointer' : ''} ${className}`} onClick={onClick}>
      {children}
    </tr>
  )
}
