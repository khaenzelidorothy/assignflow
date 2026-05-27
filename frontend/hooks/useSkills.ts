'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface Skill {
  id: string
  name: string
  description: string
  category: string
  is_active: boolean
  created_at: string
  member_count?: number
  scarcity_level?: 'red' | 'yellow' | 'green'
}

interface CreateSkillData {
  name: string
  description?: string
  category?: string
}

export function useSkills() {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: skills, error: fetchError, isLoading, mutate } = useSWR<Skill[]>(
    '/skills/',
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const createSkill = useCallback(
    async (skillData: CreateSkillData) => {
      setIsCreating(true)
      setError(null)
      try {
        const response = await api.post('/skills/', skillData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to create skill'
        setError(message)
        throw err
      } finally {
        setIsCreating(false)
      }
    },
    [mutate]
  )

  const updateSkill = useCallback(
    async (skillId: string, skillData: Partial<CreateSkillData>) => {
      setIsUpdating(true)
      setError(null)
      try {
        const response = await api.patch(`/skills/${skillId}/`, skillData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update skill'
        setError(message)
        throw err
      } finally {
        setIsUpdating(false)
      }
    },
    [mutate]
  )

  const deleteSkill = useCallback(
    async (skillId: string) => {
      setIsDeleting(true)
      setError(null)
      try {
        await api.delete(`/skills/${skillId}/`)
        await mutate()
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to delete skill'
        setError(message)
        throw err
      } finally {
        setIsDeleting(false)
      }
    },
    [mutate]
  )

  const getSkillScarcity = useCallback((skill: Skill) => {
    // Determine scarcity level based on member count
    if (!skill.member_count) return 'red'
    if (skill.member_count < 3) return 'red'
    if (skill.member_count < 8) return 'yellow'
    return 'green'
  }, [])

  return {
    skills: skills || [],
    isLoading,
    error: error || fetchError,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkillScarcity,
    isCreating,
    isUpdating,
    isDeleting,
    mutate,
  }
}
