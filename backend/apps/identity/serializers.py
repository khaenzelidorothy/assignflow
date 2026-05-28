from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'is_active', 'date_joined', 'last_login'
        ]
        read_only_fields = ['id', 'date_joined', 'last_login']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    organization_name = serializers.CharField(max_length=255, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'first_name', 'last_name', 'password', 'phone_number', 'organization_name']
    
    def create(self, validated_data):
        from apps.organizations.models import Organization, OrganizationUser
        
        password = validated_data.pop('password')
        organization_name = validated_data.pop('organization_name')
        
        # Create user
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create organization and associate user as owner
        organization = Organization.objects.create(name=organization_name)
        OrganizationUser.objects.create(
            organization=organization,
            user=user,
            role='owner'
        )
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Rename username field to email
        self.fields['email'] = self.fields.pop('username')
    
    @classmethod
    def get_token(cls, user):
        from apps.organizations.models import OrganizationUser
        
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        
        # Add organization info
        org_membership = OrganizationUser.objects.filter(user=user, is_active=True).first()
        if org_membership:
            token['organization_id'] = str(org_membership.organization.id)
            token['organization_name'] = org_membership.organization.name
            token['organization_role'] = org_membership.role
        
        return token
    
    def validate(self, attrs):
        # Get email from request
        email = attrs.get('email')
        password = attrs.get('password')
        
        if not email or not password:
            raise serializers.ValidationError("Email and password are required.")
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")
        
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        
        if not user.is_active:
            raise serializers.ValidationError("User account is inactive.")
        
        # Set user for token generation
        attrs['user'] = user
        return attrs
