from django.urls import path
from .views import TestAuthenticatedView, LoginView, RequestResetView, VerifyOTPView, ResetPasswordView, CreateEmployeeView, UpdateEmployeeStatusView
from rest_framework.authtoken.views import obtain_auth_token
 
urlpatterns = [
    path('auth/test-authenticated/', TestAuthenticatedView.as_view()),
    path('auth/login/', LoginView.as_view()),  # Login endpoint
    path('auth/request-reset/', RequestResetView.as_view()), # Request password reset endpoint
    path('auth/verify-otp/', VerifyOTPView.as_view()), #Verify OTP endpoint
    path('auth/reset-password/', ResetPasswordView.as_view()),  # Reset password endpoint
    path('auth/create-employee/', CreateEmployeeView.as_view()), # Create employee endpoint
    path('employees/<int:user_id>/status/', UpdateEmployeeStatusView.as_view(), name='update-employee-status'), # Update employee status endpoint
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),  # Token authentication endpoint
]
