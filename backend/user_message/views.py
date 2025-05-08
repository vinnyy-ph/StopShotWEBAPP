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


        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'first_name': first_name,
                'last_name': last_name,
                'phone_number': phone_number,  # Optional phone number
                'role': 'CUSTOMER',
                'is_active': True
            }
        )


        request.data['user'] = user.user_id

        serializer = UserMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()

            send_message_email(user, message_text)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)