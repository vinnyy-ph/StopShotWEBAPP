from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import CreateEmployeeSerializer, UpdateEmployeeStatusSerializer,  RequestResetSerializer, VerifyOTPSerializer, ResetPasswordSerializer
from .models import User
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .models import PasswordResetOTP
from .utils import send_otp_email

class TestAuthenticatedView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Only admin can create employees.'}, status=403)
        
        return Response({'message': 'Employee, authenticated!'}, status=status.HTTP_200_OK)


# ------------- USER AUTHENTICATION -------------


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, username=email, password=password)

        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': {
                    'id': user.user_id,
                    'email': user.email,
                    'username': user.username,
                    'role': user.role
                }
            }, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Delete the user's token to logout
        try:
            request.user.auth_token.delete()
            return Response({'message': 'Successfully logged out.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# ------------- PASSWORD RESET -------------


User = get_user_model()

class RequestResetView(APIView):
    def post(self, request):
        serializer = RequestResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
            if user.role in ['ADMIN', 'EMPLOYEE']:
                send_otp_email(user)
                return Response({"message": "OTP sent to email"})
            return Response({"error": "Unauthorized role for password reset"}, status=403)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class VerifyOTPView(APIView):
    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            # user = User.objects.get(email=email)
            otp_entry = PasswordResetOTP.objects.filter(code=otp, is_used=False).last()

            if otp_entry and not otp_entry.is_expired():
                otp_entry.is_used = True
                otp_entry.save()
                return Response({"message": "OTP verified"})
            return Response({"error": "Invalid or expired OTP"}, status=400)

        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class ResetPasswordView(APIView):
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email']
        new_password = serializer.validated_data['new_password']

        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            return Response({"message": "Password reset successfully"})
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        



# ------------ EMPLOYEE MANAGEMENT -----------


# Employee Creation
class CreateEmployeeView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Only admin can create employees.'}, status=403)

        serializer = CreateEmployeeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee created successfully.'}, status=201)
        return Response(serializer.errors, status=400)
    
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'id': user.user_id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        })



class UpdateEmployeeStatusView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        if request.user.role != 'ADMIN':
            return Response({'error': 'Only admin can create employees.'}, status=403)


    def patch(self, request, user_id):
        try:
            user = User.objects.get(user_id=user_id, role='EMPLOYEE')
        except User.DoesNotExist:
            return Response({'error': 'Employee not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateEmployeeStatusSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Employee status updated'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
