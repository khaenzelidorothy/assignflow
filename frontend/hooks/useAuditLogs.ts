'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface AuditLog {
  id: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
  }
  action: string
  entity_type: string
  entity_id: string
  before_state?: Record<string, any>
  after_state?: Record<string, any>
  timestamp: string
  ip_address?: string
  user_agent?: string
  details?: Record<string, any>
}

interface AuditFilter {
  user_id?: string
  action?: string
  entity_type?: string
  date_from?: string
  date_to?: string
}

export function useAuditLogs(filter?: AuditFilter) {
  const [error, setError] = useState<string | null>(null)

  // Build query string from filter
  const queryString = filter
    ? `?${Object.entries(filter)
        .filter(([_, value]) => value)
        .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
        .join('&')}`
    : ''

  const { data: logs, error: fetchError, isLoading, mutate } = useSWR<AuditLog[]>(
    `/audit-logs/${queryString}`,
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const getLogsByUser = useCallback(
    async (userId: string) => {
      try {
        const response = await api.get(`/audit-logs/?user_id=${userId}`)
        return response.data.results || response.data
      } catch (err: any) {
        console.error('Failed to fetch user logs:', err)
        return []
      }
    },
    []
  )

  const getLogsByAction = useCallback(
    async (action: string) => {
      try {
        const response = await api.get(`/audit-logs/?action=${action}`)
        return response.data.results || response.data
      } catch (err: any) {
        console.error('Failed to fetch action logs:', err)
        return []
      }
    },
    []
  )

  const getLogsByDateRange = useCallback(
    async (dateFrom: string, dateTo: string) => {
      try {
        const response = await api.get(
          `/audit-logs/?date_from=${dateFrom}&date_to=${dateTo}`
        )
        return response.data.results || response.data
      } catch (err: any) {
        console.error('Failed to fetch date range logs:', err)
        return []
      }
    },
    []
  )

  const getChangeDetails = useCallback((log: AuditLog) => {
    const changes: Record<string, { from: any; to: any }> = {}

    if (log.before_state && log.after_state) {
      const allKeys = new Set([
        ...Object.keys(log.before_state),
        ...Object.keys(log.after_state),
      ])

      for (const key of allKeys) {
        const before = log.before_state[key]
        const after = log.after_state[key]
        if (before !== after) {
          changes[key] = { from: before, to: after }
        }
      }
    }

    return changes
  }, [])

  const getActionDescription = useCallback((log: AuditLog) => {
    const descriptions: Record<string, string> = {
      'schedule_generated': 'Generated new schedule',
      'assignment_changed': 'Changed assignment',
      'user_removed': 'Removed user',
      'override_performed': 'Performed override',
      'member_created': 'Created new member',
      'member_updated': 'Updated member',
      'member_deleted': 'Deleted member',
      'role_created': 'Created new role',
      'role_updated': 'Updated role',
      'schedule_published': 'Published schedule',
      'schedule_locked': 'Locked schedule',
    }

    return (
      descriptions[log.action] ||
      log.action.replace(/_/g, ' ').charAt(0).toUpperCase() +
        log.action.replace(/_/g, ' ').slice(1)
    )
  }, [])

  return {
    logs: logs || [],
    isLoading,
    error: error || (fetchError ? fetchError.message || String(fetchError) : null),
    getLogsByUser,
    getLogsByAction,
    getLogsByDateRange,
    getChangeDetails,
    getActionDescription,
    mutate,
  }
}
