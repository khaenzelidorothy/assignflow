#!/bin/bash
echo "Loading seed data..."

# Create sample organization
docker-compose exec backend python manage.py shell << 'PYTHON'
from apps.organizations.models import Organization
from apps.members.models import Member

org = Organization.objects.create(
    name="Sample Church",
    slug="sample-church",
    timezone="America/New_York"
)

# Create sample members
members = [
    {"first_name": "John", "last_name": "Doe", "email": "john@example.com"},
    {"first_name": "Jane", "last_name": "Smith", "email": "jane@example.com"},
    {"first_name": "Bob", "last_name": "Johnson", "email": "bob@example.com"},
]

for member_data in members:
    Member.objects.create(organization=org, **member_data)

print(f"Created organization '{org.name}' with {len(members)} members")
PYTHON

echo "Seed data loaded successfully!"
