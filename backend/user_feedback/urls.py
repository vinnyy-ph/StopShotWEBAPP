from django.urls import path
from .views import UserFeedbackView, FeedbackResponseView

urlpatterns = [
    path('feedback/', UserFeedbackView.as_view(), name='user-feedback-list'),
    path('feedback/<int:feedback_id>/', UserFeedbackView.as_view(), name='user-feedback-detail'),  
    path('feedback/<int:feedback_id>/response/', FeedbackResponseView.as_view(), name='feedback-response'),
]