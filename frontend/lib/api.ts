import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for auth
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const authTokensStr = localStorage.getItem('authTokens')
    if (authTokensStr) {
      try {
        const authTokens = JSON.parse(authTokensStr)
        if (authTokens.access) {
          config.headers.Authorization = `Bearer ${authTokens.access}`
        }
      } catch (e) {
        console.error('Failed to parse auth tokens:', e)
      }
    }
  }
  return config
})

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If 401 and we have a refresh token, try to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== 'undefined') {
        const authTokensStr = localStorage.getItem('authTokens')
        if (authTokensStr) {
          try {
            const authTokens = JSON.parse(authTokensStr)
            if (authTokens.refresh) {
              try {
                const refreshResponse = await axios.post(`${API_URL}/auth/refresh/`, {
                  refresh: authTokens.refresh,
                })

                const newTokens = {
                  access: refreshResponse.data.access,
                  refresh: authTokens.refresh,
                }

                localStorage.setItem('authTokens', JSON.stringify(newTokens))
                originalRequest.headers.Authorization = `Bearer ${newTokens.access}`
                return api(originalRequest)
              } catch (refreshError) {
                // Refresh failed, logout
                localStorage.removeItem('authTokens')
                localStorage.removeItem('user')
                if (window.location.pathname !== '/login') {
                  window.location.href = '/login'
                }
              }
            }
          } catch (e) {
            console.error('Failed to handle token refresh:', e)
          }
        }

        // No refresh token or failed, redirect to login
        if (window.location.pathname !== '/login') {
          localStorage.removeItem('authTokens')
          localStorage.removeItem('user')
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  }
)
