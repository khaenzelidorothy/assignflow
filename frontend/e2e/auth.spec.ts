import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3004/login')
  })

  test('should login with valid credentials', async ({ page }) => {
    // Fill login form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for redirect
    await page.waitForURL('**/dashboard')

    // Verify we're on dashboard
    expect(page.url()).toContain('/dashboard')
  })

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill form with invalid credentials
    await page.fill('input[type="email"]', 'wrong@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for error message
    await page.waitForSelector('text=Invalid')

    const errorMessage = await page.textContent('.error-message')
    expect(errorMessage).toContain('Invalid')
  })

  test('should signup with organization name', async ({ page }) => {
    // Click signup tab
    await page.click('text=Sign Up')

    // Fill signup form
    await page.fill('input[placeholder*="Organization"]', 'Test Company')
    await page.fill('input[placeholder*="First"]', 'John')
    await page.fill('input[placeholder*="Last"]', 'Doe')
    await page.fill('input[type="email"]', 'newuser@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Submit form
    await page.click('button[type="submit"]')

    // Wait for success message
    await page.waitForSelector('text=successfully')

    const successMessage = await page.textContent('text=successfully')
    expect(successMessage).toContain('successfully')
  })

  test('should logout successfully', async ({ page, context }) => {
    // First, login (mocking the auth)
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'mock_token',
        url: 'http://localhost:3004',
      },
    ])

    await page.goto('http://localhost:3004/dashboard')

    // Click logout button
    await page.click('text=Logout')

    // Wait for redirect to login
    await page.waitForURL('**/login')

    expect(page.url()).toContain('/login')
  })
})

test.describe('Protected Routes', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('http://localhost:3004/dashboard')

    // Should redirect to login
    await page.waitForURL('**/login')

    expect(page.url()).toContain('/login')
  })

  test('should allow authenticated users to access protected routes', async ({
    page,
    context,
  }) => {
    // Add auth cookie
    await context.addCookies([
      {
        name: 'auth_token',
        value: 'mock_token',
        url: 'http://localhost:3004',
      },
    ])

    await page.goto('http://localhost:3004/dashboard')

    // Should stay on dashboard
    expect(page.url()).toContain('/dashboard')
  })
})
