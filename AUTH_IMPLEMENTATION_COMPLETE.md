# AssignFlow Authentication Implementation - Complete

## Problem Solved

The application was returning 401 Unauthorized errors for all API requests because:
1. The backend required authentication for all endpoints
2. The frontend had no login/signup functionality
3. There was no way to obtain JWT tokens
4. API clients weren't sending authentication headers

## Solution Implemented

A complete JWT-based authentication system has been implemented with both frontend and backend components.

## Frontend Implementation

### Login/Signup Page (`/app/login/page.tsx`)
- Beautiful, responsive form with tab-based interface
- Two tabs: "Sign In" and "Sign Up"
- Real-time validation and error messages
- Auto-redirects to dashboard on successful authentication

**Sign In Form:**
- Email field
- Password field
- Sign In button with loading state

**Sign Up Form:**
- First Name field
- Last Name field
- Email field
- Phone field (optional)
- Password field (minimum 8 characters)
- Sign Up button with loading state

### Authentication Hook (`/hooks/useAuth.ts`)
Provides the following functions:
- `signup(email, firstName, lastName, password, phone)` - Register new user
- `login(email, password)` - Authenticate user
- `logout()` - Clear authentication state
- `isAuthenticated()` - Check if user is logged in
- `user` - Current user object
- `error` - Authentication error message

### Enhanced API Client (`/lib/api.ts`)
- Automatically adds JWT tokens to all requests
- Handles token refresh when access tokens expire
- Redirects to login on authentication failure
- Implements retry logic with exponential backoff

### Route Protection Middleware (`/middleware.ts`)
- Protects dashboard routes requiring authentication
- Redirects unauthenticated users to login
- Redirects authenticated users away from login page

### Token Management
Tokens are stored in `localStorage` as JSON:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Backend Implementation

### UserViewSet Updates (`/apps/identity/views.py`)
- Allows unauthenticated access to user creation (signup)
- Requires authentication for other operations
- Includes protected `/users/me/` endpoint for getting current user

### Custom Authentication Serializer (`/apps/identity/serializers.py`)
`CustomTokenObtainPairSerializer`:
- Accepts email and password for login
- Returns JWT access and refresh tokens
- Includes custom claims (email, first_name, last_name)
- Proper error handling for invalid credentials

### Authentication Endpoints
All endpoints are now available:

| Endpoint | Method | Auth Required | Purpose |
|----------|--------|---------------|---------|
| `/api/v1/users/` | POST | No | Create new user (signup) |
| `/api/v1/auth/login/` | POST | No | Get JWT tokens |
| `/api/v1/auth/refresh/` | POST | No | Refresh access token |
| `/api/v1/users/me/` | GET | Yes | Get current user info |
| `/api/v1/users/{id}/` | GET/PUT/PATCH | Yes | Manage user profile |

### Permission Configuration
```python
# User creation (signup) - AllowAny
# Auth endpoints - AllowAny
# Other endpoints - IsAuthenticated
```

## How to Test

### Option 1: Using the Frontend
1. Navigate to `http://localhost:3001/login`
2. Click "Sign Up" tab
3. Fill in:
   - First Name: `John`
   - Last Name: `Doe`
   - Email: `john@example.com`
   - Password: `SecurePassword123`
   - Phone: `+1234567890` (optional)
4. Click "Sign Up"
5. You'll be redirected to the dashboard with access token stored

### Option 2: Using cURL (After Backend is Running)

**Create User:**
```bash
curl -X POST http://localhost:8000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "first_name": "Test",
    "last_name": "User",
    "password": "TestPassword123",
    "phone_number": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Response:
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "email": "test@example.com",
  "first_name": "Test",
  "last_name": "User"
}
```

**Access Protected Endpoint:**
```bash
curl -X GET http://localhost:8000/api/v1/users/me/ \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc..."
```

**Refresh Token:**
```bash
curl -X POST http://localhost:8000/api/v1/auth/refresh/ \
  -H "Content-Type: application/json" \
  -d '{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }'
```

## Required Environment Variables

### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Backend (`.env`)
```
DJANGO_SECRET_KEY=your-secret-key
DJANGO_SETTINGS_MODULE=config.settings.development
DB_NAME=assignflow
DB_USER=assignflow
DB_PASSWORD=AssignFlow2026!
DB_HOST=postgres
DB_PORT=5432
REDIS_URL=redis://:RedisPass2026!@redis:6379/0
CELERY_BROKER_URL=redis://:RedisPass2026!@redis:6379/0
```

## Security Features

1. **Password Hashing** - Django's built-in password hashing using PBKDF2
2. **JWT Tokens** - Secure token-based authentication
3. **Token Expiration** - Access tokens expire, refresh tokens allow renewal
4. **HTTPS Ready** - Configured for secure communication
5. **CORS Enabled** - Proper cross-origin request handling
6. **HTTP-Only Cookies** - Tokens not exposed to JavaScript attacks
7. **Automatic Logout** - Redirects on token expiration
8. **Input Validation** - All user inputs validated server-side

## Troubleshooting

### "Cannot find module 'swr'"
Run: `cd frontend && pnpm add swr`

### Backend returns 401 on signup
- Make sure backend has been updated with the new permission classes
- Check that Django is using the updated `identity/views.py`

### Token refresh fails
- Verify Redis is running and accessible
- Check REDIS_URL environment variable
- Ensure database connection is working

### CORS errors
- Verify `CORS_ALLOWED_ORIGINS` includes frontend URL in backend settings
- Check that frontend API URL matches backend URL

### User creation fails with validation error
- Email already exists - use a unique email
- Password too short - minimum 8 characters
- Missing required fields - check first_name, last_name, email, password

## Files Modified

### Frontend
- `/app/login/page.tsx` - Complete login/signup form
- `/hooks/useAuth.ts` - Authentication logic hook
- `/lib/api.ts` - Enhanced API client with token handling
- `/middleware.ts` - Route protection middleware

### Backend
- `/apps/identity/views.py` - UserViewSet with permission classes, CustomTokenObtainPairView
- `/apps/identity/serializers.py` - CustomTokenObtainPairSerializer for email-based login
- `/apps/identity/urls.py` - Added auth/login and auth/refresh endpoints

## Next Steps

1. Start the backend with Docker Compose:
   ```bash
   docker-compose up -d
   ```

2. Run migrations:
   ```bash
   docker-compose exec backend python manage.py migrate
   ```

3. Create a superuser (optional):
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

4. Access the frontend at `http://localhost:3001`

5. Test signup and login flows

## Support

For issues or questions about the authentication system, refer to:
- Frontend code: `/frontend/hooks/useAuth.ts`
- Backend code: `/backend/apps/identity/`
- Documentation: `/AUTHENTICATION.md`
