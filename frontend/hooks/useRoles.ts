'use client'

import { useState, useCallback } from 'react'
import useSWR from 'swr'
import { api } from '@/lib/api'

interface Role {
  id: string
  name: string
  description: string
  required_skill: {
    id: string
    name: string
  }
  required_people_count: number
  priority: number
  is_active: boolean
  current_assignments?: number
  created_at: string
}

interface CreateRoleData {
  name: string
  description?: string
  required_skill?: string
  required_people_count: number
  priority: number
  constraints?: Record<string, any>
}

export function useRoles() {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: roles, error: fetchError, isLoading, mutate } = useSWR<Role[]>(
    '/roles/',
    async (url) => {
      const response = await api.get(url)
      return response.data.results || response.data
    },
    { revalidateOnFocus: false }
  )

  const createRole = useCallback(
    async (roleData: CreateRoleData) => {
      setIsCreating(true)
      setError(null)
      try {
        const response = await api.post('/roles/', roleData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to create role'
        setError(message)
        throw err
      } finally {
        setIsCreating(false)
      }
    },
    [mutate]
  )

  const updateRole = useCallback(
    async (roleId: string, roleData: Partial<CreateRoleData>) => {
      setIsUpdating(true)
      setError(null)
      try {
        const response = await api.patch(`/roles/${roleId}/`, roleData)
        await mutate()
        return response.data
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to update role'
        setError(message)
        throw err
      } finally {
        setIsUpdating(false)
      }
    },
    [mutate]
  )

  const deleteRole = useCallback(
    async (roleId: string) => {
      setIsDeleting(true)
      setError(null)
      try {
        await api.delete(`/roles/${roleId}/`)
        await mutate()
      } catch (err: any) {
        const message = err.response?.data?.detail || 'Failed to delete role'
        setError(message)
        throw err
      } finally {
        setIsDeleting(false)
      }
    },
    [mutate]
  )

  const calculateDifficulty = useCallback((role: Role) => {
    // Simple difficulty calculation based on priority and requirement count
    const baseDifficulty = role.priority
    const peopleModifier = Math.min(role.required_people_count * 2, 10)
    return Math.min(Math.round((baseDifficulty + peopleModifier) / 2), 10)
  }, [])

  const getStaffingStatus = useCallback((role: Role) => {
    const current = role.current_assignments || 0
    const required = role.required_people_count
    
    if (current === 0) return 'unfilled'
    if (current < required) return 'partial'
    if (current === required) return 'filled'
    return 'overstaffed'
  }, [])

  return {
    roles: roles || [],
    isLoading,
    error: error || fetchError,
    createRole,
    updateRole,
    deleteRole,
    calculateDifficulty,
    getStaffingStatus,
    isCreating,
    isUpdating,
    isDeleting,
    mutate,
  }
}
