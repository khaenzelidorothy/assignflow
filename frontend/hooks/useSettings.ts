'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface OrganizationSettings {
  fairness_priority_level: 'low' | 'medium' | 'high'
  workload_balancing_strength: number // 0-10
  repeat_restriction_period: number // days
  max_assignments_per_week: number
  whatsapp_enabled: boolean
  sms_fallback_enabled: boolean
  email_alerts_enabled: boolean
  scheduling_mode: 'fully_automatic' | 'semi_automatic' | 'manual_approval'
  ai_suggestions_enabled: boolean
  ai_predictive_scheduling_enabled: boolean
  ai_burnout_detection_enabled: boolean
  updated_at: string
}

export function useSettings() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: settings, error: fetchError, isLoading, mutate } = useSWR<OrganizationSettings>(
    '/organization/settings/',
    async (url) => {
      const response = await api.get(url)
      return response.data
    },
    { revalidateOnFocus: false }
  )

  const updateSettings = useCallback(
    async (updates: Partial<OrganizationSettings>) => {
      setIsUpdating(true)
      setError(null)
      try {
        const response = await api.patch('/organization/settings/', updates)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update settings'
        setError(message)
        throw err
      } finally {
        setIsUpdating(false)
      }
    },
    [mutate]
  )

  const updateNotificationSettings = useCallback(
    async (
      whatsappEnabled: boolean,
      smsFallbackEnabled: boolean,
      emailAlertsEnabled: boolean
    ) => {
      return updateSettings({
        whatsapp_enabled: whatsappEnabled,
        sms_fallback_enabled: smsFallbackEnabled,
        email_alerts_enabled: emailAlertsEnabled,
      })
    },
    [updateSettings]
  )

  const updateSchedulingMode = useCallback(
    async (mode: 'fully_automatic' | 'semi_automatic' | 'manual_approval') => {
      return updateSettings({ scheduling_mode: mode })
    },
    [updateSettings]
  )

  const updateAISettings = useCallback(
    async (
      suggestionsEnabled: boolean,
      predictiveEnabled: boolean,
      burnoutDetectionEnabled: boolean
    ) => {
      return updateSettings({
        ai_suggestions_enabled: suggestionsEnabled,
        ai_predictive_scheduling_enabled: predictiveEnabled,
        ai_burnout_detection_enabled: burnoutDetectionEnabled,
      })
    },
    [updateSettings]
  )

  const updateWorkloadSettings = useCallback(
    async (
      fairnessPriority: 'low' | 'medium' | 'high',
      balancingStrength: number,
      maxAssignments: number
    ) => {
      return updateSettings({
        fairness_priority_level: fairnessPriority,
        workload_balancing_strength: balancingStrength,
        max_assignments_per_week: maxAssignments,
      })
    },
    [updateSettings]
  )

  return {
    settings,
    isLoading,
    error: error || fetchError,
    updateSettings,
    updateNotificationSettings,
    updateSchedulingMode,
    updateAISettings,
    updateWorkloadSettings,
    isUpdating,
    mutate,
  }
}
