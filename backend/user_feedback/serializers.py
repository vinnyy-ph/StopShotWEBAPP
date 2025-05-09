from rest_framework import serializers
from .models import UserFeedback
from user_management.serializers import CustomerSerializer

class UserFeedbackSerializer(serializers.ModelSerializer):
    user = CustomerSerializer(read_only=True)  # Use CustomerSerializer for the user field
    
    class Meta:
        model = UserFeedback 
        fields = '__all__'

class UserFeedbackWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFeedback
        fields = '__all__'

# Then in the view:
# Use UserFeedbackSerializer for GET requests
# Use UserFeedbackWriteSerializer for POST requests
