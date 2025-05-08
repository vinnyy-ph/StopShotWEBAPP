from django.urls import path
from .views import UserFeedbackView, FeedbackResponseView

urlpatterns = [
    path('feedback/', UserFeedbackView.as_view(), name='user-feedback'),  
    path('feedback/<int:feedback_id>/response/', FeedbackResponseView.as_view(), name='feedback-response'),
]