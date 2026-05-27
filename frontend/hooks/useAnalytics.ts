'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export function useAnalytics(organizationId?: string) {
  const [metrics, setMetrics] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!organizationId) return

    const fetchMetrics = async () => {
      try {
        const response = await api.get('/analytics/dashboard/')
        setMetrics(response.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [organizationId])

  return { metrics, isLoading }
}
