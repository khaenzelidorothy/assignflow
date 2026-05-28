'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface Assignment {
  id: string
  member: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  role: {
    id: string
    name: string
  }
  assignment_reason: Record<string, any>
  auto_generated: boolean
  score?: number
}

interface Schedule {
  id: string
  name: string
  date: string
  status: 'draft' | 'pending_review' | 'approved' | 'published' | 'locked' | 'archived'
  version: number
  assignments: Assignment[]
  assignment_count?: number
  configuration: Record<string, any>
  created_by?: string
  created_at: string
  updated_at: string
}

interface GenerateScheduleData {
  date: string
  configuration?: Record<string, any>
  run_async?: boolean
}

interface CeleryTaskStatus {
  task_id: string
  status: 'pending' | 'processing' | 'success' | 'failed'
  result?: Schedule
  error?: string
}

export function useSchedules(scheduleId?: string) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isLocking, setIsLocking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [taskStatus, setTaskStatus] = useState<CeleryTaskStatus | null>(null)

  const { data: schedules, error: fetchError, isLoading, mutate } = useSWR<Schedule[]>(
    '/schedules/',
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const { data: currentSchedule, mutate: mutateSchedule } = useSWR<Schedule>(
    scheduleId ? `/schedules/${scheduleId}/` : null,
    async (url) => {
      const response = await api.get(url)
      return response.data
    }
  )

  const generateSchedule = useCallback(
    async (data: GenerateScheduleData) => {
      setIsGenerating(true)
      setError(null)
      try {
        const response = await api.post('/schedules/generate/', data)

        // If async, we get a task_id and status 'processing'
        if (response.status === 202) {
          setTaskStatus({
            task_id: response.data.task_id,
            status: 'processing',
          })

          // Poll for completion
          const pollTaskStatus = async (taskId: string) => {
            for (let i = 0; i < 30; i++) {
              // Poll for 30 seconds
              await new Promise((resolve) => setTimeout(resolve, 1000))
              try {
                const statusResponse = await api.get(`/schedules/task-status/${taskId}/`)
                if (statusResponse.data.status === 'success') {
                  setTaskStatus({
                    task_id: taskId,
                    status: 'success',
                    result: statusResponse.data.result,
                  })
                  await mutate()
                  return statusResponse.data.result
                } else if (statusResponse.data.status === 'failed') {
                  throw new Error(statusResponse.data.error || 'Schedule generation failed')
                }
              } catch (err) {
                console.error('Error polling task status:', err)
              }
            }
            throw new Error('Schedule generation timeout')
          }

          return await pollTaskStatus(response.data.task_id)
        } else {
          // Synchronous response
          await mutate()
          return response.data
        }
      } catch (err: any) {
        const message = err.response?.data?.detail || err.message || 'Failed to generate schedule'
        setError(message)
        setTaskStatus({
          task_id: '',
          status: 'failed',
          error: message,
        })
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    [mutate]
  )

  const regenerateRole = useCallback(
    async (scheduleId: string, roleId: string) => {
      setIsGenerating(true)
      setError(null)
      try {
        const response = await api.post(`/schedules/${scheduleId}/regenerate-role/`, {
          role_id: roleId,
        })
        await mutate()
        await mutateSchedule()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to regenerate role'
        setError(message)
        throw err
      } finally {
        setIsGenerating(false)
      }
    },
    [mutate, mutateSchedule]
  )

  const publishSchedule = useCallback(
    async (scheduleId: string) => {
      setIsPublishing(true)
      setError(null)
      try {
        const response = await api.post(`/schedules/${scheduleId}/publish/`, {})
        await mutate()
        await mutateSchedule()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to publish schedule'
        setError(message)
        throw err
      } finally {
        setIsPublishing(false)
      }
    },
    [mutate, mutateSchedule]
  )

  const lockSchedule = useCallback(
    async (scheduleId: string) => {
      setIsLocking(true)
      setError(null)
      try {
        const response = await api.post(`/schedules/${scheduleId}/lock/`, {})
        await mutate()
        await mutateSchedule()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to lock schedule'
        setError(message)
        throw err
      } finally {
        setIsLocking(false)
      }
    },
    [mutate, mutateSchedule]
  )

  const updateAssignment = useCallback(
    async (assignmentId: string, memberId: string, roleId: string) => {
      setError(null)
      try {
        const response = await api.patch(`/assignments/${assignmentId}/`, {
          member: memberId,
          role: roleId,
        })
        await mutateSchedule()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update assignment'
        setError(message)
        throw err
      }
    },
    [mutateSchedule]
  )

  return {
    schedules: schedules || [],
    currentSchedule,
    isLoading,
    error: error || (fetchError ? fetchError.message || String(fetchError) : null),
    taskStatus,
    generateSchedule,
    regenerateRole,
    publishSchedule,
    lockSchedule,
    updateAssignment,
    isGenerating,
    isPublishing,
    isLocking,
    mutate,
    mutateSchedule,
  }
}
