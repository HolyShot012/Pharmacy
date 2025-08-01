from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Users
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import re

class UserRegistrationSerializer(serializers.ModelSerializer):
    # Fields for Django User model
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(required=True, max_length=150)
    last_name = serializers.CharField(required=True, max_length=150)
    
    # Fields for custom Users model
    phone_number = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    current_address = serializers.CharField(max_length=200, required=False, allow_blank=True, allow_null=True)
    province = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    city = serializers.CharField(max_length=50, required=False, allow_blank=True, allow_null=True)
    avatar_url = serializers.CharField(max_length=200, required=False, allow_blank=True, allow_null=True)
    preferred_theme = serializers.CharField(max_length=20, required=False, allow_blank=True, allow_null=True)
    role = serializers.CharField(max_length=50, required=True)
    birth_date = serializers.DateField(required=False, allow_null=True)

    class Meta:
        model = User
        fields = [
            'username', 'email', 'password', 'first_name', 'last_name',
            'phone_number', 'current_address', 'province', 'city',
            'avatar_url', 'preferred_theme', 'role', 'birth_date'
        ]

    def validate(self, data):
        if User.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists'})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'email': 'Email already exists'})
        if len(data['password']) < 8:
            raise serializers.ValidationError({'password': 'Password must be at least 8 characters long'})
        if data.get('phone_number'):
            phone_regex = r'^\+?\d{9,15}$'
            if not re.match(phone_regex, data['phone_number']):
                raise serializers.ValidationError({'phone_number': 'Invalid phone number format'})
        valid_roles = ['patient', 'doctor', 'pharmacist', 'admin']
        if data['role'] not in valid_roles:
            raise serializers.ValidationError({'role': f'Role must be one of {valid_roles}'})
        return data

    def create(self, validated_data):
        users_data = {
            'phone_number': validated_data.pop('phone_number', None),
            'current_address': validated_data.pop('current_address', None),
            'province': validated_data.pop('province', None),
            'city': validated_data.pop('city', None),
            'avatar_url': validated_data.pop('avatar_url', None),
            'preferred_theme': validated_data.pop('preferred_theme', None),
            'role': validated_data.pop('role'),
            'birth_date': validated_data.pop('birth_date', None),
        }
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        Users.objects.create(id=user, **users_data)
        refresh = RefreshToken.for_user(user)
        return {
            'user': user,
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }

    def to_representation(self, instance):
        user = instance['user']
        users = Users.objects.get(id=user)
        return {
            'refresh': instance['refresh'],
            'access': instance['access'],
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'phone_number': users.phone_number,
                'current_address': users.current_address,
                'province': users.province,
                'city': users.city,
                'avatar_url': users.avatar_url,
                'preferred_theme': users.preferred_theme,
                'role': users.role,
                'birth_date': users.birth_date
            }
        }

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError({'non_field_errors': 'Invalid username or password'})
        data['user'] = user
        return data

class UserLogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField(required=True)

    def validate(self, data):
        try:
            token = RefreshToken(data['refresh'])
            token.blacklist()
        except Exception as e:
            raise serializers.ValidationError({'refresh': 'Invalid or already blacklisted token'})
        return data