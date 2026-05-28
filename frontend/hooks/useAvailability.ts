'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface Availability {
  id: string
  member: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  week_start: string
  available_days: string[] // ['Monday', 'Tuesday', ...]
  submitted_at: string
  submitted_by_self: boolean
}

interface AvailabilityInput {
  member_id: string
  week_start: string
  available_days: string[]
}

export function useAvailability(weekStart?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAutoFilling, setIsAutoFilling] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: availabilities, error: fetchError, isLoading, mutate } = useSWR<Availability[]>(
    weekStart ? `/availability/?week_start=${weekStart}` : '/availability/',
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const submitAvailability = useCallback(
    async (availabilityData: AvailabilityInput) => {
      setIsSubmitting(true)
      setError(null)
      try {
        const response = await api.post('/availability/', availabilityData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to submit availability'
        setError(message)
        throw err
      } finally {
        setIsSubmitting(false)
      }
    },
    [mutate]
  )

  const autoFillFromLastWeek = useCallback(
    async (memberId: string, weekStart: string) => {
      setIsAutoFilling(true)
      setError(null)
      try {
        const response = await api.post('/availability/auto-fill/', {
          member_id: memberId,
          week_start: weekStart,
        })
        await mutate()
        return response.data
      } catch (err: any) {
        const message =
          err.response?.data?.detail || 'Failed to auto-fill availability'
        setError(message)
        throw err
      } finally {
        setIsAutoFilling(false)
      }
    },
    [mutate]
  )

  const getMembersNotSubmitted = useCallback(
    (allMembers: any[]) => {
      if (!availabilities) return allMembers
      const submittedMemberIds = new Set(
        availabilities.map((a) => a.member.id)
      )
      return allMembers.filter((m) => !submittedMemberIds.has(m.id))
    },
    [availabilities]
  )

  const getAvailabilityPercentage = useCallback(() => {
    if (!availabilities) return 0
    return Math.round((availabilities.length / (availabilities.length + 1)) * 100)
  }, [availabilities])

  return {
    availabilities: availabilities || [],
    isLoading,
    error: error || (fetchError ? fetchError.message || String(fetchError) : null),
    submitAvailability,
    autoFillFromLastWeek,
    getMembersNotSubmitted,
    getAvailabilityPercentage,
    isSubmitting,
    isAutoFilling,
    mutate,
  }
}
