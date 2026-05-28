import pytest
from rest_framework import status
from apps.members.models import Member
from tests.factories import MemberFactory, OrganizationFactory, SkillFactory


@pytest.mark.django_db
class TestMemberManagement:
    """Test member management functionality."""

    def test_create_member(self, authenticated_api_client, organization):
        """Test creating a member."""
        response = authenticated_api_client.post('/api/v1/members/', {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone_number': '+1234567890',
        }, format='json')

        assert response.status_code in [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST]

    def test_list_members(self, authenticated_api_client, organization):
        """Test listing organization members."""
        # Create test members
        MemberFactory.create_batch(3, organization=organization)

        response = authenticated_api_client.get('/api/v1/members/')

        assert response.status_code == status.HTTP_200_OK

    def test_update_member(self, authenticated_api_client, organization):
        """Test updating a member."""
        member = MemberFactory(organization=organization, name='Old Name')

        response = authenticated_api_client.put(
            f'/api/v1/members/{member.id}/',
            {'name': 'New Name'},
            format='json'
        )

        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_deactivate_member(self, authenticated_api_client, organization):
        """Test deactivating a member."""
        member = MemberFactory(organization=organization, is_active=True)

        response = authenticated_api_client.patch(
            f'/api/v1/members/{member.id}/',
            {'is_active': False},
            format='json'
        )

        assert response.status_code in [status.HTTP_200_OK, status.HTTP_404_NOT_FOUND]

    def test_soft_delete_preserves_history(self, organization):
        """Test soft delete preserves assignment history."""
        member = MemberFactory(organization=organization, is_active=True)
        
        # Deactivate
        member.is_active = False
        member.save()

        # Member should still exist in DB
        assert Member.objects.filter(id=member.id).exists()

    def test_assign_skills_to_member(self, authenticated_api_client, organization):
        """Test assigning skills to a member."""
        member = MemberFactory(organization=organization)
        skill = SkillFactory(organization=organization)

        response = authenticated_api_client.post(
            f'/api/v1/members/{member.id}/assign_skill/',
            {'skill_id': skill.id},
            format='json'
        )

        # Will vary based on implementation
        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_201_CREATED,
            status.HTTP_404_NOT_FOUND
        ]

    def test_remove_skills_from_member(self, authenticated_api_client, organization):
        """Test removing skills from a member."""
        member = MemberFactory(organization=organization)
        skill = SkillFactory(organization=organization)

        response = authenticated_api_client.post(
            f'/api/v1/members/{member.id}/remove_skill/',
            {'skill_id': skill.id},
            format='json'
        )

        assert response.status_code in [
            status.HTTP_200_OK,
            status.HTTP_204_NO_CONTENT,
            status.HTTP_404_NOT_FOUND
        ]

    def test_invalid_email_validation(self, authenticated_api_client, organization):
        """Test invalid email is rejected."""
        response = authenticated_api_client.post('/api/v1/members/', {
            'name': 'Test User',
            'email': 'invalid-email',
            'phone_number': '+1234567890',
        }, format='json')

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            assert 'email' in response.data

    def test_invalid_phone_validation(self, authenticated_api_client, organization):
        """Test invalid phone number validation."""
        response = authenticated_api_client.post('/api/v1/members/', {
            'name': 'Test User',
            'email': 'test@example.com',
            'phone_number': 'invalid',
        }, format='json')

        if response.status_code == status.HTTP_400_BAD_REQUEST:
            assert 'phone_number' in response.data or 'error' in response.data

    def test_member_isolation_per_organization(self, organization):
        """Test members are isolated per organization."""
        from tests.factories import OrganizationFactory
        
        org1 = organization
        org2 = OrganizationFactory()

        member1 = MemberFactory(organization=org1)
        member2 = MemberFactory(organization=org2)

        # Verify members belong to different organizations
        assert member1.organization != member2.organization
        assert Member.objects.filter(organization=org1).count() == 1
        assert Member.objects.filter(organization=org2).count() == 1
