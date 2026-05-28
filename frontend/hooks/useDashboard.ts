'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface DashboardSummary {
  total_members: number
  available_this_week: number
  unassigned_roles: number
  active_schedules: number
  fairness_score: number
  burnout_risk_count: number
  alerts: Array<{
    id: string
    type: 'warning' | 'error' | 'info'
    message: string
    urgency: number
  }>
  upcoming_schedule?: {
    date: string
    assignment_count: number
    unfilled_roles: number
  }
  insight: string
}

export function useDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: summary, error: fetchError, isLoading, mutate } = useSWR<DashboardSummary>(
    '/dashboard/summary/',
    async (url) => {
      const response = await api.get(url)
      return response.data
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30000, // Refresh every 30 seconds
    }
  )

  const refreshDashboard = useCallback(async () => {
    setIsRefreshing(true)
    try {
      await mutate()
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to refresh dashboard'
      setError(message)
    } finally {
      setIsRefreshing(false)
    }
  }, [mutate])

  const isEverythingOkay = useCallback(() => {
    if (!summary) return false
    return (
      summary.fairness_score >= 75 &&
      summary.burnout_risk_count === 0 &&
      summary.unassigned_roles === 0 &&
      summary.alerts.length === 0
    )
  }, [summary])

  const getHealthStatus = useCallback(() => {
    if (!summary) return 'unknown'
    if (summary.burnout_risk_count > 0) return 'critical'
    if (summary.unassigned_roles > 0 || summary.alerts.length > 2) return 'warning'
    if (summary.fairness_score < 70) return 'attention'
    return 'healthy'
  }, [summary])

  const getMostUrgentAlert = useCallback(() => {
    if (!summary || summary.alerts.length === 0) return null
    return summary.alerts.reduce((prev, current) =>
      prev.urgency > current.urgency ? prev : current
    )
  }, [summary])

  return {
    summary,
    isLoading,
    error: error || (fetchError ? fetchError.message || String(fetchError) : null),
    refreshDashboard,
    isRefreshing,
    isEverythingOkay,
    getHealthStatus,
    getMostUrgentAlert,
    mutate,
  }
}
