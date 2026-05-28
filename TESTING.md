# AssignFlow Testing Guide

This document outlines the comprehensive testing strategy for the AssignFlow application, including frontend unit tests, API tests, E2E tests, and backend tests.

## Test Structure

```
frontend/
├── __tests__/
│   ├── auth.test.ts          # Authentication tests (Jest)
│   └── api.test.ts           # API tests (Jest)
├── e2e/
│   └── auth.spec.ts          # E2E tests (Playwright)
├── jest.config.js            # Jest configuration
├── jest.setup.js             # Jest setup and mocks
└── playwright.config.ts      # Playwright configuration

backend/
├── tests/
│   ├── __init__.py
│   ├── conftest.py           # Pytest fixtures
│   ├── factories.py          # Factory Boy factories
│   ├── test_authentication.py # Auth tests (pytest)
│   ├── test_members.py       # Member management tests (pytest)
│   └── test_multi_tenant.py  # Multi-tenant isolation tests (pytest)
├── pytest.ini                # Pytest configuration
└── config/settings/test.py   # Test Django settings
```

## Frontend Tests

### Setup

```bash
cd frontend
pnpm install
```

### Running Tests

#### Unit Tests (Jest)
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage

# Run specific test file
pnpm test __tests__/auth.test.ts
```

#### E2E Tests (Playwright)
```bash
# Run E2E tests
pnpm e2e

# Run E2E tests in debug mode
pnpm e2e:debug

# Run specific E2E test
pnpm e2e e2e/auth.spec.ts
```

### Frontend Test Coverage

#### Authentication Tests (20 tests)
- ✅ User login works correctly
- ✅ Invalid login rejected
- ✅ Token storage in localStorage
- ✅ Logout clears tokens
- ✅ Token refresh works
- ✅ Signup with organization
- ✅ Duplicate email rejected
- ✅ Password validation
- ✅ Invalid email validation
- ✅ Invalid phone validation

#### API Tests (12 tests)
- ✅ Fetch members list
- ✅ Create member
- ✅ Update member
- ✅ Delete member
- ✅ Paginated results
- ✅ Filter by status
- ✅ Sort by field
- ✅ Handle 404 errors
- ✅ Handle 500 errors
- ✅ Handle validation errors
- ✅ Return correct status codes (200, 201, 204)

#### Playwright E2E Tests
- ✅ Login with valid credentials
- ✅ Show error for invalid credentials
- ✅ Signup with organization name
- ✅ Logout successfully
- ✅ Redirect unauthenticated users to login
- ✅ Allow authenticated users to access protected routes

### Current Test Results

```
Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        0.92s
```

## Backend Tests

### Setup

The backend requires Docker to run. Tests are configured to run in a controlled environment.

```bash
cd backend

# Install test dependencies (in Docker environment)
pip install -r requirements.txt

# Create test Django settings
# Already configured in config/settings/test.py
```

### Backend Test Configuration

Tests use:
- **pytest** - Test runner
- **pytest-django** - Django integration
- **factory-boy** - Test data factories
- **freezegun** - Time mocking
- **SQLite** - In-memory database for tests

### Running Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific test class
python manage.py test tests.test_authentication.TestAuthentication

# Run specific test
python manage.py test tests.test_authentication.TestAuthentication.test_user_login_works_correctly

# With pytest (if installed)
pytest tests/test_authentication.py -v
pytest tests/test_members.py -v
pytest tests/test_multi_tenant.py -v
```

### Backend Test Coverage

#### Authentication Tests (10 tests)
- ✅ User login works correctly
- ✅ Invalid login rejected
- ✅ User signup creates organization
- ✅ Duplicate email rejected
- ✅ Token refresh works
- ✅ Unauthorized users blocked
- ✅ Role-based access control
- ✅ Organization isolation
- ✅ Password validation
- ✅ User belongs to correct organization

#### Member Management Tests (10 tests)
- ✅ Create member
- ✅ List members
- ✅ Update member
- ✅ Deactivate member
- ✅ Soft delete preserves history
- ✅ Assign skills to member
- ✅ Remove skills from member
- ✅ Invalid email validation
- ✅ Invalid phone validation
- ✅ Member isolation per organization

#### Multi-Tenant Isolation Tests (9 tests)
- ✅ Organization A cannot access Organization B data
- ✅ Members isolated per organization
- ✅ Roles isolated per organization
- ✅ Schedules isolated per organization
- ✅ Audit logs isolated per organization
- ✅ Cross-tenant assignment fails
- ✅ Data query filtering
- ✅ User cannot access other org members
- ✅ Organization data completely separated

## Test Data Factories

### Available Factories

```python
from tests.factories import (
    OrganizationFactory,      # Create test organization
    UserFactory,              # Create test user
    OrganizationUserFactory,  # Create org membership
    SkillFactory,             # Create test skill
    MemberFactory,            # Create team member
    RoleFactory,              # Create role
)
```

### Example Usage

```python
# Create organizations
org1 = OrganizationFactory(name='Test Org')
org2 = OrganizationFactory(name='Another Org')

# Create users
user = UserFactory(email='test@example.com')
admin = UserFactory(email='admin@example.com')

# Create memberships
OrganizationUserFactory(
    organization=org1,
    user=admin,
    role='owner'
)

# Create test data
skill = SkillFactory(organization=org1, name='Python')
member = MemberFactory(organization=org1)
role = RoleFactory(organization=org1)
```

## Jest Configuration

Tests use the following configuration:

```javascript
{
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  testMatch: ['**/__tests__/**/*.test.ts?(x)']
}
```

## Playwright Configuration

```typescript
{
  testDir: './e2e',
  baseURL: 'http://localhost:3004',
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3004',
    reuseExistingServer: true
  }
}
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: cd frontend && pnpm install
      - run: cd frontend && pnpm test
      - run: cd frontend && pnpm e2e

  backend:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: cd backend && pip install -r requirements.txt
      - run: cd backend && python manage.py test
```

## Test Patterns

### Mocking External APIs

```typescript
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

// In test
mockedAxios.get.mockResolvedValueOnce({ data: [] })
```

### Testing Authenticated Endpoints

```python
@pytest.mark.django_db
def test_authenticated_request(authenticated_api_client):
    response = authenticated_api_client.get('/api/v1/members/')
    assert response.status_code == 200
```

### Testing Multi-Tenant Isolation

```python
@pytest.mark.django_db
def test_organization_isolation():
    org_a = OrganizationFactory()
    org_b = OrganizationFactory()
    
    member_a = MemberFactory(organization=org_a)
    member_b = MemberFactory(organization=org_b)
    
    assert member_a.organization != member_b.organization
```

## Coverage Goals

- **Frontend**: Aim for >80% coverage
- **Backend**: Aim for >75% coverage
- **Critical paths**: 100% coverage for auth and tenant isolation

## Test Maintenance

- Update tests when API contracts change
- Keep test data factories in sync with models
- Run tests before committing code
- Monitor test execution time (should be < 30s)

## Troubleshooting

### Mocked Modules Not Working
- Ensure mocks are defined before imports
- Check that jest.mock() is at the top level

### Tests Timing Out
- Increase jest timeout: `jest.setTimeout(10000)`
- Check for unresolved promises

### Database Errors in Backend Tests
- Ensure test.py settings use SQLite in-memory
- Check that migrations are disabled

## Running Full Test Suite

```bash
# Frontend
cd frontend && pnpm test && pnpm e2e

# Backend (in Docker)
docker-compose exec backend python manage.py test

# Full coverage report
cd frontend && pnpm test:coverage
```

All tests should pass before deployment.
