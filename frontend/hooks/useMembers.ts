'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface Member {
  id: string
  first_name: string
  last_name: string
  email: string
  phone_number: string
  status: 'active' | 'inactive' | 'on_leave' | 'suspended'
  member_skills: Array<{
    id: string
    skill: { id: string; name: string }
    proficiency_level: number
  }>
  fairness_profile?: {
    fairness_score: number
    burnout_score: number
    workload_score: number
    total_assignments: number
  }
}

interface CreateMemberData {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  skills: string[]
  role_group?: string
}

export function useMembers() {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: members, error: fetchError, isLoading, mutate } = useSWR<Member[]>(
    '/members/',
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const createMember = useCallback(
    async (memberData: CreateMemberData) => {
      setIsCreating(true)
      setError(null)
      try {
        const response = await api.post('/members/', {
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          email: memberData.email,
          phone_number: memberData.phone_number,
        })

        // Add skills
        if (memberData.skills.length > 0) {
          for (const skillId of memberData.skills) {
            await api.post('/member-skills/', {
              member: response.data.id,
              skill: skillId,
            })
          }
        }

        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to create member'
        setError(message)
        throw err
      } finally {
        setIsCreating(false)
      }
    },
    [mutate]
  )

  const updateMember = useCallback(
    async (memberId: string, memberData: Partial<CreateMemberData>) => {
      setIsUpdating(true)
      setError(null)
      try {
        const response = await api.patch(`/members/${memberId}/`, memberData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update member'
        setError(message)
        throw err
      } finally {
        setIsUpdating(false)
      }
    },
    [mutate]
  )

  const deleteMember = useCallback(
    async (memberId: string) => {
      setIsDeleting(true)
      setError(null)
      try {
        // Soft delete - set status to inactive
        await api.patch(`/members/${memberId}/`, { status: 'inactive' })
        await mutate()
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to delete member'
        setError(message)
        throw err
      } finally {
        setIsDeleting(false)
      }
    },
    [mutate]
  )

  return {
    members: members || [],
    isLoading,
    error: error || fetchError,
    createMember,
    updateMember,
    deleteMember,
    isCreating,
    isUpdating,
    isDeleting,
    mutate,
  }
}
