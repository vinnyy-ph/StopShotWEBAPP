from rest_framework import serializers
from .models import User

class CreateEmployeeSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'username', 'password']

    def create(self, validated_data):
        validated_data['role'] = 'EMPLOYEE'
        validated_data['is_staff'] = True  # Optional lang: for admin dashboard access
        return User.objects.create_user(**validated_data)

class RequestResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

class VerifyOTPSerializer(serializers.Serializer):
    # email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(min_length=6)