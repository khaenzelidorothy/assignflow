import factory
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization, OrganizationUser
from apps.members.models import Member, Skill
from apps.roles.models import Role

User = get_user_model()


class OrganizationFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Organization

    name = factory.Faker('company')
    created_at = factory.Faker('date_time')


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    email = factory.Faker('email')
    first_name = factory.Faker('first_name')
    last_name = factory.Faker('last_name')
    password = factory.PostGenerationMethodCall('set_password', 'password123')
    is_active = True


class OrganizationUserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = OrganizationUser

    organization = factory.SubFactory(OrganizationFactory)
    user = factory.SubFactory(UserFactory)
    role = 'owner'
    is_active = True


class SkillFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Skill

    organization = factory.SubFactory(OrganizationFactory)
    name = factory.Faker('word')
    description = factory.Faker('text')


class MemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Member

    organization = factory.SubFactory(OrganizationFactory)
    user = factory.SubFactory(UserFactory)
    name = factory.Faker('name')
    email = factory.Faker('email')
    phone_number = factory.Faker('phone_number')
    is_active = True


class RoleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Role

    organization = factory.SubFactory(OrganizationFactory)
    name = factory.Faker('job')
    description = factory.Faker('text')
    required_count = factory.Faker('random_int', min=1, max=5)
