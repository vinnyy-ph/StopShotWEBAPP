from rest_framework import serializers
from .models import User
import uuid

class CreateEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6, required=False)
    email = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    phone_num = serializers.CharField(required=False)
    hire_date = serializers.DateField(required=False)
    role = serializers.CharField(required=False, default='BARTENDER')

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'first_name', 'last_name', 'phone_num', 'hire_date', 'role']

    def create(self, validated_data):
        # Generate username and email if not provided
        if 'username' not in validated_data or not validated_data['username']:
            # Create username from first_name and last_name
            first_name = validated_data.get('first_name', '').lower()
            last_name = validated_data.get('last_name', '').lower()
            
            # Create base username
            base_username = f"{first_name}.{last_name}".replace(' ', '_')
            
            # Check if username exists and append random string if needed
            username = base_username
            while User.objects.filter(username=username).exists():
                random_suffix = str(uuid.uuid4())[:8]
                username = f"{base_username}_{random_suffix}"
                
            validated_data['username'] = username
            
        if 'email' not in validated_data or not validated_data['email']:
            # Create email from username
            username = validated_data['username']
            validated_data['email'] = f"{username}@stopshot.com"
            
        if 'password' not in validated_data or not validated_data['password']:
            # Generate a random password
            validated_data['password'] = str(uuid.uuid4())[:12]
            
        # Set default role if not provided
        if 'role' not in validated_data or not validated_data['role']:
            validated_data['role'] = 'BARTENDER'
        
        validated_data['is_staff'] = True  # For admin dashboard access
        return User.objects.create_user(**validated_data)

class UpdateEmployeeStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['is_active']

class UpdateEmployeeSerializer(serializers.ModelSerializer):
    phone_num = serializers.CharField(required=False, allow_blank=True, allow_null=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone_num', 'hire_date', 'role', 'is_active']
        
    def validate_phone_num(self, value):
        if value == '':
            return None
        return value

class RequestResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    # email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=6)

class EmployeeSerializer(serializers.ModelSerializer):
    """Serializer for listing and managing employees"""
    last_login_date = serializers.SerializerMethodField()
    last_login_time = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'user_id',
            'username',
            'email',
            'first_name',
            'last_name',
            'role',
            'hire_date',
            'is_active',
            'is_staff',
            'is_superuser',
            'last_login_date',
            'last_login_time',
            'groups',
            'user_permissions',
            'phone_number'
        ]
    
    def get_last_login_date(self, obj):
        """Get the last login date in ISO format"""
        return obj.last_login.date().isoformat() if obj.last_login else ''
    
    def get_last_login_time(self, obj):
        """Get the last login time in HH:MM format"""
        return obj.last_login.time().strftime('%H:%M') if obj.last_login else ''
    
    def get_phone_number(self, obj):
        """Get phone number from phone_num field"""
        return str(obj.phone_num) if obj.phone_num else ''

class CustomerSerializer(serializers.ModelSerializer):
    """Serializer for listing customers"""
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'phone_num', 'role']