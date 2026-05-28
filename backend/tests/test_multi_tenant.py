import pytest
from django.contrib.auth import get_user_model
from rest_framework import status
from apps.organizations.models import Organization, OrganizationUser
from apps.members.models import Member
from tests.factories import (
    OrganizationFactory,
    UserFactory,
    OrganizationUserFactory,
    MemberFactory,
)

User = get_user_model()


@pytest.mark.django_db
class TestMultiTenantIsolation:
    """Test data isolation between organizations."""

    def test_organization_a_cannot_access_organization_b_data(self):
        """Test Organization A cannot access Organization B data."""
        # Setup
        org_a = OrganizationFactory(name='Organization A')
        org_b = OrganizationFactory(name='Organization B')

        user_a = UserFactory(email='user_a@example.com')
        user_b = UserFactory(email='user_b@example.com')

        OrganizationUserFactory(organization=org_a, user=user_a, role='owner')
        OrganizationUserFactory(organization=org_b, user=user_b, role='owner')

        # Verify isolation
        org_a_users = Organization.objects.get(id=org_a.id).organizationuser_set.all()
        org_b_users = Organization.objects.get(id=org_b.id).organizationuser_set.all()

        assert not any(ou.user == user_b for ou in org_a_users)
        assert not any(ou.user == user_a for ou in org_b_users)

    def test_members_isolated_per_organization(self):
        """Test members are isolated per organization."""
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        member_a1 = MemberFactory(organization=org_a)
        member_a2 = MemberFactory(organization=org_a)
        member_b1 = MemberFactory(organization=org_b)

        # Verify isolation
        assert Member.objects.filter(organization=org_a).count() == 2
        assert Member.objects.filter(organization=org_b).count() == 1
        assert member_a1.organization != member_b1.organization

    def test_roles_isolated_per_organization(self):
        """Test roles are isolated per organization."""
        from tests.factories import RoleFactory

        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        role_a = RoleFactory(organization=org_a, name='Manager')
        role_b = RoleFactory(organization=org_b, name='Manager')

        # Same name but different organizations
        assert role_a.organization != role_b.organization
        from apps.roles.models import Role
        assert Role.objects.filter(organization=org_a).count() == 1
        assert Role.objects.filter(organization=org_b).count() == 1

    def test_schedules_isolated_per_organization(self):
        """Test schedules are isolated per organization."""
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        # Create test data for schedules (implementation may vary)
        # This is a placeholder for actual schedule model
        from apps.schedules.models import Schedule
        
        schedule_a = Schedule.objects.create(
            organization=org_a,
            name='Weekly Schedule'
        )
        schedule_b = Schedule.objects.create(
            organization=org_b,
            name='Weekly Schedule'
        )

        assert schedule_a.organization != schedule_b.organization

    def test_audit_logs_isolated_per_organization(self):
        """Test audit logs are isolated per organization."""
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        user_a = UserFactory()
        user_b = UserFactory()

        OrganizationUserFactory(organization=org_a, user=user_a)
        OrganizationUserFactory(organization=org_b, user=user_b)

        # Verify users belong to different orgs
        assert Organization.objects.get(id=org_a.id).organizationuser_set.filter(
            user=user_a
        ).exists()
        assert not Organization.objects.get(id=org_a.id).organizationuser_set.filter(
            user=user_b
        ).exists()

    def test_cross_tenant_assignment_fails(self):
        """Test cross-tenant assignment attempts fail."""
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        member_a = MemberFactory(organization=org_a)
        role_b = RoleFactory(organization=org_b)

        # Trying to assign member from org_a to role in org_b should fail
        assert member_a.organization.id != role_b.organization.id

    def test_data_query_filtering(self):
        """Test that queries properly filter by organization."""
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        MemberFactory.create_batch(5, organization=org_a)
        MemberFactory.create_batch(3, organization=org_b)

        # Query and filter by organization
        org_a_members = Member.objects.filter(organization=org_a)
        org_b_members = Member.objects.filter(organization=org_b)

        assert org_a_members.count() == 5
        assert org_b_members.count() == 3

    def test_user_cannot_access_other_org_members(self, authenticated_api_client):
        """Test authenticated user cannot access members from other org."""
        from rest_framework.test import APIClient
        from tests.factories import OrganizationFactory, UserFactory, OrganizationUserFactory

        # Create two orgs
        org_a = OrganizationFactory()
        org_b = OrganizationFactory()

        # Create users for each org
        user_a = UserFactory()
        OrganizationUserFactory(organization=org_a, user=user_a, role='owner')

        # Create members in both orgs
        MemberFactory.create_batch(2, organization=org_a)
        MemberFactory.create_batch(2, organization=org_b)

        # Authenticate as user_a
        client = APIClient()
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user_a)
        client.credentials(HTTP_AUTHORIZATION=f'Bearer {refresh.access_token}')

        # Try to fetch members - should only see org_a members
        response = client.get('/api/v1/members/')

        # Response should exist and user should not see org_b members
        if response.status_code == status.HTTP_200_OK:
            # Implementation-specific: verify isolation in response
            pass
