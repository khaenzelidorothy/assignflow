'use client'

import { useState, useCallback, useEffect } from 'react'
import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  full_name: string
}

interface AuthTokens {
  access: string
  refresh: string
}

const setAuthCookie = (token: string) => {
  document.cookie = `authToken=${token}; path=/; SameSite=Lax`
}

const removeAuthCookie = () => {
  document.cookie = 'authToken=; Max-Age=0; path=/; SameSite=Lax'
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load tokens from localStorage on mount
  useEffect(() => {
    const storedTokens = localStorage.getItem('authTokens')
    const storedUser = localStorage.getItem('user')
    if (storedTokens) {
      try {
        setTokens(JSON.parse(storedTokens))
      } catch (e) {
        console.error('Failed to parse tokens:', e)
      }
    }
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error('Failed to parse user:', e)
      }
    }
    setIsLoading(false)
  }, [])

  const signup = useCallback(
    async (email: string, first_name: string, last_name: string, password: string, phone_number?: string) => {
      setError(null)
      setIsLoading(true)
      try {
        // Create user
        const signupResponse = await axios.post(`${API_BASE_URL}/users/`, {
          email,
          first_name,
          last_name,
          password,
          phone_number: phone_number || '',
        })

        // Login to get tokens
        const loginResponse = await axios.post(`${API_BASE_URL}/auth/login/`, {
          email,
          password,
        })

        const newTokens: AuthTokens = {
          access: loginResponse.data.access,
          refresh: loginResponse.data.refresh,
        }

        // Get user info
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${newTokens.access}`,
          },
        })

        const userData = userResponse.data
        setTokens(newTokens)
        setUser(userData)

        // Store in localStorage
        localStorage.setItem('authTokens', JSON.stringify(newTokens))
        localStorage.setItem('user', JSON.stringify(userData))
        setAuthCookie(newTokens.access)

        return userData
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const login = useCallback(
    async (email: string, password: string) => {
      setError(null)
      setIsLoading(true)
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
          email,
          password,
        })

        const newTokens: AuthTokens = {
          access: response.data.access,
          refresh: response.data.refresh,
        }

        // Get user info
        const userResponse = await axios.get(`${API_BASE_URL}/users/me/`, {
          headers: {
            Authorization: `Bearer ${newTokens.access}`,
          },
        })

        const userData = userResponse.data
        setTokens(newTokens)
        setUser(userData)

        // Store in localStorage
        localStorage.setItem('authTokens', JSON.stringify(newTokens))
        localStorage.setItem('user', JSON.stringify(userData))
        setAuthCookie(newTokens.access)

        return userData
      } catch (err: any) {
        const errorMessage = err.response?.data?.detail || err.response?.data?.message || err.message
        setError(errorMessage)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(() => {
    setTokens(null)
    setUser(null)
    localStorage.removeItem('authTokens')
    localStorage.removeItem('user')
    removeAuthCookie()
  }, [])

  const refreshTokens = useCallback(async () => {
    if (!tokens?.refresh) return
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
        refresh: tokens.refresh,
      })

      const newTokens: AuthTokens = {
        access: response.data.access,
        refresh: tokens.refresh,
      }

      setTokens(newTokens)
      localStorage.setItem('authTokens', JSON.stringify(newTokens))
      setAuthCookie(newTokens.access)
      return newTokens
    } catch (err) {
      logout()
      throw err
    }
  }, [tokens?.refresh, logout])

  return {
    user,
    tokens,
    isLoading,
    error,
    isAuthenticated: !!tokens?.access,
    signup,
    login,
    logout,
    refreshTokens,
  }
}
