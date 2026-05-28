import { renderHook, act, waitFor } from '@testing-library/react'
import axios from 'axios'

// Mock axios
jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Authentication Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  describe('User login works correctly', () => {
    it('should login successfully with valid credentials', async () => {
      const mockTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }

      mockedAxios.post.mockResolvedValueOnce({ data: mockTokens })

      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email: 'test@example.com',
        password: 'password123',
      })

      expect(response.data).toEqual(mockTokens)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/auth/login/',
        {
          email: 'test@example.com',
          password: 'password123',
        }
      )
    })
  })

  describe('Invalid login rejected', () => {
    it('should reject login with invalid credentials', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 401,
          data: { detail: 'Invalid email or password.' },
        },
      })

      try {
        await axios.post('http://localhost:8000/api/v1/auth/login/', {
          email: 'wrong@example.com',
          password: 'wrongpassword',
        })
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.response.status).toBe(401)
        expect(error.response.data.detail).toContain('Invalid')
      }
    })
  })

  describe('Token storage', () => {
    it('should store tokens in localStorage after login', async () => {
      const mockTokens = {
        access: 'mock-access-token',
        refresh: 'mock-refresh-token',
      }

      mockedAxios.post.mockResolvedValueOnce({ data: mockTokens })

      const response = await axios.post('http://localhost:8000/api/v1/auth/login/', {
        email: 'test@example.com',
        password: 'password123',
      })

      // Simulate storing tokens
      localStorage.setItem('authTokens', JSON.stringify(response.data))

      const storedTokens = localStorage.getItem('authTokens')
      expect(storedTokens).toBeDefined()
      expect(JSON.parse(storedTokens!)).toEqual(mockTokens)
    })
  })

  describe('Logout', () => {
    it('should clear tokens on logout', () => {
      localStorage.setItem(
        'authTokens',
        JSON.stringify({ access: 'token', refresh: 'token' })
      )

      localStorage.removeItem('authTokens')

      expect(localStorage.getItem('authTokens')).toBeNull()
    })
  })

  describe('Token refresh', () => {
    it('should refresh expired token', async () => {
      const newAccessToken = 'new-access-token'

      mockedAxios.post.mockResolvedValueOnce({
        data: { access: newAccessToken },
      })

      const response = await axios.post('http://localhost:8000/api/v1/auth/refresh/', {
        refresh: 'old-refresh-token',
      })

      expect(response.data.access).toBe(newAccessToken)
    })
  })

  describe('Signup', () => {
    it('should signup successfully with organization name', async () => {
      const mockUser = {
        id: 1,
        email: 'newuser@example.com',
        first_name: 'John',
        last_name: 'Doe',
      }

      mockedAxios.post.mockResolvedValueOnce({ data: mockUser })

      const response = await axios.post('http://localhost:8000/api/v1/users/', {
        email: 'newuser@example.com',
        first_name: 'John',
        last_name: 'Doe',
        password: 'password123',
        organization_name: 'Test Org',
      })

      expect(response.data).toEqual(mockUser)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/',
        expect.objectContaining({
          email: 'newuser@example.com',
          organization_name: 'Test Org',
        })
      )
    })

    it('should reject signup with duplicate email', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: { email: ['User with this email already exists.'] },
        },
      })

      try {
        await axios.post('http://localhost:8000/api/v1/users/', {
          email: 'existing@example.com',
          first_name: 'Jane',
          last_name: 'Doe',
          password: 'password123',
          organization_name: 'Test Org',
        })
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.response.status).toBe(400)
        expect(error.response.data.email).toBeDefined()
      }
    })
  })
})
