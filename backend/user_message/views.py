from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserMessageSerializer
from .models import UserMessage
from user_management.models import User
from .utils import send_message_email

class UserMessageView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "The 'email' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        phone_number = request.data.get('phone_number', None)  # Optional phone number
        message_text = request.data.get('message_text')
        if not message_text:
            return Response(
                {"error": "The 'message_text' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = email.split('@')[0]

        # Remove phone_number from User creation
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': first_name,
                'last_name': last_name,
                'role': 'CUSTOMER',
                'is_active': True
            }
        )

        # Create a custom data dictionary for the UserMessage
        message_data = {
            'user': user.user_id,
            'phone_number': phone_number,  # Store phone_number in UserMessage model
            'message_text': message_text
        }

        serializer = UserMessageSerializer(data=message_data)
        if serializer.is_valid():
            message = serializer.save()
            
            # Pass the phone number to send_message_email
            send_message_email(user, message_text, phone_number)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)