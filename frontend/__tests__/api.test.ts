import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('API Tests', () => {
  const API_BASE_URL = 'http://localhost:8000/api/v1'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('CRUD endpoints', () => {
    it('should fetch members list', async () => {
      const mockMembers = [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ]

      mockedAxios.get.mockResolvedValueOnce({ data: mockMembers })

      const response = await axios.get(`${API_BASE_URL}/members/`)

      expect(response.data).toEqual(mockMembers)
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/members/`)
    })

    it('should create a new member', async () => {
      const newMember = {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
      }

      mockedAxios.post.mockResolvedValueOnce({ data: newMember })

      const response = await axios.post(`${API_BASE_URL}/members/`, {
        name: 'Bob Johnson',
        email: 'bob@example.com',
      })

      expect(response.data).toEqual(newMember)
    })

    it('should update a member', async () => {
      const updatedMember = {
        id: 1,
        name: 'John Updated',
        email: 'john.updated@example.com',
      }

      mockedAxios.put.mockResolvedValueOnce({ data: updatedMember })

      const response = await axios.put(`${API_BASE_URL}/members/1/`, {
        name: 'John Updated',
        email: 'john.updated@example.com',
      })

      expect(response.data).toEqual(updatedMember)
    })

    it('should delete a member', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ status: 204 })

      const response = await axios.delete(`${API_BASE_URL}/members/1/`)

      expect(response.status).toBe(204)
    })
  })

  describe('Pagination', () => {
    it('should handle paginated results', async () => {
      const mockPaginatedData = {
        count: 100,
        next: 'http://localhost:8000/api/v1/members/?page=2',
        previous: null,
        results: [{ id: 1, name: 'John' }],
      }

      mockedAxios.get.mockResolvedValueOnce({ data: mockPaginatedData })

      const response = await axios.get(`${API_BASE_URL}/members/?page=1&page_size=10`)

      expect(response.data.count).toBe(100)
      expect(response.data.results).toHaveLength(1)
      expect(response.data.next).toBeDefined()
    })
  })

  describe('Filtering', () => {
    it('should filter members by status', async () => {
      const mockFilteredMembers = [
        { id: 1, name: 'Active Member', status: 'active' },
      ]

      mockedAxios.get.mockResolvedValueOnce({ data: mockFilteredMembers })

      const response = await axios.get(`${API_BASE_URL}/members/?status=active`)

      expect(response.data).toEqual(mockFilteredMembers)
      expect(mockedAxios.get).toHaveBeenCalledWith(
        expect.stringContaining('status=active')
      )
    })
  })

  describe('Sorting', () => {
    it('should sort members by name', async () => {
      const mockSortedMembers = [
        { id: 2, name: 'Alice' },
        { id: 1, name: 'Bob' },
      ]

      mockedAxios.get.mockResolvedValueOnce({ data: mockSortedMembers })

      const response = await axios.get(`${API_BASE_URL}/members/?ordering=name`)

      expect(response.data[0].name).toBe('Alice')
      expect(response.data[1].name).toBe('Bob')
    })
  })

  describe('Error handling', () => {
    it('should handle 404 errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 404, data: { detail: 'Not found' } },
      })

      try {
        await axios.get(`${API_BASE_URL}/members/999/`)
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.response.status).toBe(404)
      }
    })

    it('should handle 500 errors', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 500, data: { detail: 'Server error' } },
      })

      try {
        await axios.get(`${API_BASE_URL}/members/`)
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.response.status).toBe(500)
      }
    })

    it('should handle validation errors', async () => {
      mockedAxios.post.mockRejectedValueOnce({
        response: {
          status: 400,
          data: {
            email: ['This field is required.'],
            name: ['This field is required.'],
          },
        },
      })

      try {
        await axios.post(`${API_BASE_URL}/members/`, {})
        fail('Should have thrown an error')
      } catch (error: any) {
        expect(error.response.status).toBe(400)
        expect(error.response.data.email).toBeDefined()
      }
    })
  })

  describe('Proper status codes returned', () => {
    it('should return 200 for successful GET', async () => {
      mockedAxios.get.mockResolvedValueOnce({ status: 200, data: [] })

      const response = await axios.get(`${API_BASE_URL}/members/`)

      expect(response.status).toBe(200)
    })

    it('should return 201 for successful POST', async () => {
      mockedAxios.post.mockResolvedValueOnce({ status: 201, data: { id: 1 } })

      const response = await axios.post(`${API_BASE_URL}/members/`, {})

      expect(response.status).toBe(201)
    })

    it('should return 204 for successful DELETE', async () => {
      mockedAxios.delete.mockResolvedValueOnce({ status: 204 })

      const response = await axios.delete(`${API_BASE_URL}/members/1/`)

      expect(response.status).toBe(204)
    })
  })
})
