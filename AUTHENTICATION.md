# AssignFlow Authentication System

## Overview

AssignFlow now has a complete JWT-based authentication system that allows users to sign up, log in, and access protected dashboard pages securely.

## Architecture

### Frontend Authentication Flow

1. **User Registration (Signup)**
   - User provides: email, first name, last name, password, phone number (optional)
   - Request: `POST /api/v1/users/` - Creates user account
   - Automatic login after successful signup

2. **User Login**
   - User provides: email, password
   - Request: `POST /api/v1/auth/login/` - Returns JWT tokens
   - Tokens stored in localStorage for subsequent requests

3. **API Requests**
   - All API requests include Authorization header: `Bearer {access_token}`
   - Automatically handled by axios interceptor in `/frontend/lib/api.ts`

4. **Token Refresh**
   - When access token expires (401 response):
   - System automatically sends refresh token to `/api/v1/auth/refresh/`
   - New access token obtained and retry the original request
   - If refresh fails, user redirected to login page

5. **Protected Routes**
   - All dashboard pages require authentication
   - Middleware checks for valid token before allowing access
   - Unauthenticated users redirected to `/login`

## Files Created/Modified

### New Files
- `/frontend/hooks/useAuth.ts` - Core authentication hook
- `/frontend/middleware.ts` - Route protection middleware
- `/frontend/app/login/page.tsx` - Login/signup page (updated)

### Modified Files
- `/frontend/lib/api.ts` - Added token handling and refresh logic

## Usage

### For Users

1. **Navigate to Login Page**
   ```
   http://localhost:3001/login
   ```

2. **Sign Up (New Users)**
   - Click "Sign Up" tab
   - Enter: First Name, Last Name, Email, Password (min 8 chars), Phone (optional)
   - Click "Sign Up" button
   - Automatically logged in and redirected to dashboard

3. **Sign In (Existing Users)**
   - Click "Sign In" tab
   - Enter: Email, Password
   - Click "Sign In" button
   - Redirected to dashboard

4. **Access Protected Pages**
   - All dashboard pages automatically protected
   - Unauthenticated access redirected to login
   - Session persists across page refreshes via localStorage

### For Developers

#### Using useAuth Hook in Components

```tsx
'use client'

import { useAuth } from '@/hooks/useAuth'

export function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth()

  if (!isAuthenticated) {
    return <div>Please log in</div>
  }

  return (
    <div>
      Welcome, {user?.full_name}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

#### Accessing Current User

```tsx
const { user, tokens, isLoading, error } = useAuth()

console.log(user) // { id, email, first_name, last_name, phone_number, full_name }
console.log(tokens) // { access, refresh }
```

#### Making Authenticated API Calls

```tsx
import { api } from '@/lib/api'

// Tokens automatically added to request headers
const response = await api.get('/members/')
```

## Token Management

### Token Storage
- Access Token: Stored in localStorage under `authTokens.access`
- Refresh Token: Stored in localStorage under `authTokens.refresh`
- User Info: Stored in localStorage under `user`

### Token Lifecycle
1. **Obtainment**: During login/signup via `/auth/login/`
2. **Usage**: Included in all API requests as Bearer token
3. **Refresh**: Automatically renewed on 401 response
4. **Revocation**: Cleared on logout or refresh failure

### Environment Configuration

Set `NEXT_PUBLIC_API_URL` environment variable to point to backend:

```bash
# .env.local (development)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Production
NEXT_PUBLIC_API_URL=https://api.yoursite.com/api/v1
```

## Backend API Endpoints

### Authentication Endpoints

- `POST /api/v1/auth/login/` - Obtain JWT tokens
  ```json
  Request: { "email": "user@example.com", "password": "securepass" }
  Response: { "access": "jwt_token", "refresh": "jwt_token" }
  ```

- `POST /api/v1/auth/refresh/` - Refresh access token
  ```json
  Request: { "refresh": "refresh_token" }
  Response: { "access": "new_jwt_token" }
  ```

- `POST /api/v1/auth/verify/` - Verify token validity
  ```json
  Request: { "token": "jwt_token" }
  Response: { "status": "valid" } or 401
  ```

### User Management Endpoints

- `POST /api/v1/users/` - Create new user (signup)
  ```json
  Request: {
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "securepass",
    "phone_number": "+1234567890" (optional)
  }
  Response: User object with id, email, etc.
  ```

- `GET /api/v1/users/me/` - Get current user
  ```json
  Response: {
    "id": "uuid",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "full_name": "John Doe",
    "phone_number": "+1234567890",
    "is_active": true
  }
  ```

## Security Considerations

1. **Token Storage**: Stored in localStorage (not httpOnly cookies) to allow client-side access for axios
   - Consider using secure httpOnly cookies in production with a token extraction endpoint

2. **HTTPS**: Always use HTTPS in production to prevent token interception

3. **CORS**: Configure CORS properly on backend to allow frontend origin

4. **Token Expiration**: Configure JWT expiration times in backend settings

5. **Logout**: Tokens are cleared from localStorage and user redirected to login

## Error Handling

### Common Authentication Errors

1. **Invalid Credentials**
   - User provides wrong email/password
   - Display: "Invalid email or password"

2. **Email Already Exists**
   - During signup, email already registered
   - Display: Email validation error from backend

3. **Network Error**
   - Backend unreachable
   - Display: Connection error message

4. **Token Expired**
   - Access token expired and refresh failed
   - Action: Automatic redirect to login page

5. **Unauthorized Access**
   - Attempting to access protected route without token
   - Action: Middleware redirects to login

## Testing Authentication

### Test Signup Flow
```bash
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "testpass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Use Token in Authenticated Request
```bash
curl -H "Authorization: Bearer {access_token}" \
  http://localhost:8000/api/v1/users/me/
```

## Future Enhancements

1. **Social Authentication** - Google, GitHub OAuth
2. **Two-Factor Authentication** - SMS/Email verification
3. **Password Reset** - Email-based password recovery
4. **Session Management** - Multiple device sessions
5. **Role-Based Access** - Admin, user, viewer roles
6. **Organization Management** - Multi-org support

## Troubleshooting

### Users Can't Login
- Check backend is running on correct port (8000)
- Verify API_URL environment variable
- Check browser console for API errors

### Tokens Not Persisting
- Check localStorage is enabled in browser
- Verify no browser extensions blocking storage
- Check dev tools → Application → Local Storage

### Redirected to Login Unexpectedly
- Tokens may have expired
- Refresh endpoint might be failing
- Check backend token configuration

### Protected Routes Not Working
- Middleware might not be processing correctly
- Check auth tokens in localStorage
- Verify middleware.ts is in correct location

## References

- [JWT (JSON Web Tokens)](https://jwt.io)
- [Django REST Framework JWT](https://django-rest-framework-simplejwt.readthedocs.io/)
- [Next.js Middleware](https://nextjs.org/docs/advanced-features/middleware)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
