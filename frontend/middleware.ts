import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/members',
  '/skills',
  '/roles',
  '/schedules',
  '/availability',
  '/analytics',
  '/audit-logs',
  '/settings',
]

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get auth token from cookies (we'll set it there)
  const token = request.cookies.get('authToken')?.value

  // Check if route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If trying to access protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If trying to access auth route with token, redirect to dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
