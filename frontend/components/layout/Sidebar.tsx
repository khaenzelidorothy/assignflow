interface SidebarProps {
  children: React.ReactNode
  className?: string
  collapsed?: boolean
}

export function Sidebar({ children, className = '', collapsed = false }: SidebarProps) {
  return (
    <aside className={`bg-white border-r border-gray-200 h-full overflow-y-auto transition-all duration-200 ${
      collapsed ? 'w-20' : 'w-64'
    } ${className}`}>
      {children}
    </aside>
  )
}
