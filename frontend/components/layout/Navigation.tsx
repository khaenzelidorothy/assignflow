'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

const menuItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Members', href: '/members', icon: '👥' },
  { name: 'Skills', href: '/skills', icon: '🎯' },
  { name: 'Roles', href: '/roles', icon: '📋' },
  { name: 'Availability', href: '/availability', icon: '📅' },
  { name: 'Schedules', href: '/schedules', icon: '🗓️' },
  { name: 'Analytics', href: '/analytics', icon: '📈' },
  { name: 'Audit Logs', href: '/audit-logs', icon: '🔍' },
  { name: 'Settings', href: '/settings', icon: '⚙️' },
]

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [orgName, setOrgName] = useState<string>('Organization')
  const [userName, setUserName] = useState<string>('')
  const { logout } = useAuth()

  useEffect(() => {
    // Get organization and user info from tokens
    const authTokensStr = localStorage.getItem('authTokens')
    const userStr = localStorage.getItem('user')
    
    if (authTokensStr) {
      try {
        const tokens = JSON.parse(authTokensStr)
        // Decode JWT to get organization info
        const parts = tokens.access.split('.')
        if (parts.length === 3) {
          const decoded = JSON.parse(atob(parts[1]))
          if (decoded.organization_name) {
            setOrgName(decoded.organization_name)
          }
        }
      } catch (e) {
        console.log('[v0] Error decoding token:', e)
      }
    }

    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user.first_name) {
          setUserName(user.first_name)
        }
      } catch (e) {
        console.log('[v0] Error parsing user:', e)
      }
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col`}>
        <div className="flex items-center h-16 px-6 border-b">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">AF</span>
          </div>
          <span className="text-lg font-bold">AssignFlow</span>
        </div>
        
        {/* Organization Info */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="text-xs text-gray-600 mb-1">Organization</div>
          <h3 className="text-sm font-semibold text-gray-900 truncate">{orgName}</h3>
          {userName && <p className="text-xs text-gray-600 mt-1">Logged in as: {userName}</p>}
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t p-4 space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <span>⚙️</span>
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
