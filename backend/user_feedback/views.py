from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import UserFeedbackSerializer
from .models import UserFeedback
from .utils import send_feedback_email, send_response_email
from user_management.models import User 


class UserFeedbackView(APIView):
    def get(self, request):
        feedbacks = UserFeedback.objects.all()
        serializer = UserFeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response(
                {"error": "The 'email' field is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
 
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        username = email.split('@')[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'username': username,
                'email': email, 
                'first_name': first_name,
                'last_name': last_name,
                'role': 'CUSTOMER',  
                'is_active': True
            }
        )

        request.data['user'] = user.user_id

        serializer = UserFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            send_feedback_email(user, serializer.data['feedback_text'])
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, feedback_id):
        try:
            feedback = UserFeedback.objects.get(feedback_id=feedback_id)
            feedback.delete()
            return Response({"message": "Feedback deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except UserFeedback.DoesNotExist:
            return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)


class FeedbackResponseView(APIView):
    def post(self, request, feedback_id):
        try:
            feedback = UserFeedback.objects.get(feedback_id=feedback_id)
        except UserFeedback.DoesNotExist:
            return Response({"error": "Feedback not found."}, status=status.HTTP_404_NOT_FOUND)

        response_text = request.data.get('response_text')
        if not response_text:
            return Response({"error": "The 'response_text' field is required."}, status=status.HTTP_400_BAD_REQUEST)


        feedback.response_text = response_text
        feedback.save()

        # Notify the user via email
        send_response_email(feedback.user, feedback.feedback_text, response_text)

        return Response({"message": "Response sent successfully."}, status=status.HTTP_200_OK)