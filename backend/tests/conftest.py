import os
import django
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.test')
django.setup()

import pytest
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization, OrganizationUser
from tests.factories import (
    UserFactory,
    OrganizationFactory,
    OrganizationUserFactory,
)

User = get_user_model()


@pytest.fixture
def api_client():
    """Provide an API client."""
    return APIClient()


@pytest.fixture
def user():
    """Create a test user."""
    return UserFactory()


@pytest.fixture
def organization():
    """Create a test organization."""
    return OrganizationFactory()


@pytest.fixture
def authenticated_user(organization):
    """Create a user with organization membership."""
    user = UserFactory()
    OrganizationUserFactory(
        organization=organization,
        user=user,
        role='owner'
    )
    return user


@pytest.fixture
def authenticated_api_client(authenticated_user):
    """Provide an authenticated API client."""
    client = APIClient()
    # Get tokens for the user
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(authenticated_user)
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')
    return client


@pytest.fixture
def org_with_users(organization):
    """Create an organization with multiple users."""
    users = UserFactory.create_batch(5)
    for user in users:
        OrganizationUserFactory(
            organization=organization,
            user=user,
            role='member'
        )
    return organization, users
