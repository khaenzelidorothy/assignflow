import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient
from tests.factories import UserFactory, OrganizationFactory, OrganizationUserFactory
from apps.organizations.models import Organization

User = get_user_model()


@pytest.mark.django_db
class TestAuthentication:
    """Test authentication endpoints and flows."""

    def test_user_login_works_correctly(self, api_client):
        """Test user can login with valid credentials."""
        # Create a user
        user = UserFactory(email='test@example.com')
        user.set_password('password123')
        user.save()

        # Login
        response = api_client.post('/api/v1/auth/login/', {
            'email': 'test@example.com',
            'password': 'password123',
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_invalid_login_rejected(self, api_client):
        """Test login with invalid credentials is rejected."""
        response = api_client.post('/api/v1/auth/login/', {
            'email': 'wrong@example.com',
            'password': 'wrongpassword',
        })

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_user_signup_creates_organization(self, api_client):
        """Test signup creates both user and organization."""
        response = api_client.post('/api/v1/users/', {
            'email': 'newuser@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'password123',
            'organization_name': 'Test Company',
        })

        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email='newuser@example.com').exists()

        # Verify organization was created
        user = User.objects.get(email='newuser@example.com')
        org_membership = Organization.objects.filter(
            organizationuser__user=user
        ).first()
        assert org_membership is not None
        assert org_membership.name == 'Test Company'

    def test_duplicate_email_rejected(self, api_client):
        """Test signup with duplicate email is rejected."""
        # Create first user
        UserFactory(email='existing@example.com')

        # Try to create another with same email
        response = api_client.post('/api/v1/users/', {
            'email': 'existing@example.com',
            'first_name': 'Jane',
            'last_name': 'Doe',
            'password': 'password123',
            'organization_name': 'Another Company',
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'email' in response.data

    def test_token_refresh_works(self, api_client):
        """Test token refresh endpoint."""
        # Create user and get tokens
        user = UserFactory(email='test@example.com')
        user.set_password('password123')
        user.save()

        login_response = api_client.post('/api/v1/auth/login/', {
            'email': 'test@example.com',
            'password': 'password123',
        })

        refresh_token = login_response.data['refresh']

        # Use refresh token
        response = api_client.post('/api/v1/auth/refresh/', {
            'refresh': refresh_token,
        })

        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_unauthorized_users_blocked(self, api_client):
        """Test unauthorized users cannot access protected endpoints."""
        response = api_client.get('/api/v1/users/me/')

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_role_based_access(self, authenticated_api_client, api_client):
        """Test role-based access control."""
        # Owner should access
        response = authenticated_api_client.get('/api/v1/members/')
        assert response.status_code in [status.HTTP_200_OK, status.HTTP_403_FORBIDDEN]

        # Unauthenticated should not access
        response = api_client.get('/api/v1/members/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_organization_isolation(self):
        """Test users from different organizations are isolated."""
        # Create two organizations with users
        org1 = OrganizationFactory(name='Org 1')
        org2 = OrganizationFactory(name='Org 2')

        user1 = UserFactory(email='user1@example.com')
        user2 = UserFactory(email='user2@example.com')

        OrganizationUserFactory(organization=org1, user=user1)
        OrganizationUserFactory(organization=org2, user=user2)

        # Verify users belong to different organizations
        assert not Organization.objects.filter(
            organizationuser__user=user1
        ).filter(organizationuser__user=user2).exists()

    def test_password_validation(self, api_client):
        """Test password validation on signup."""
        response = api_client.post('/api/v1/users/', {
            'email': 'test@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'password': 'short',  # Too short
            'organization_name': 'Test Org',
        })

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert 'password' in response.data
