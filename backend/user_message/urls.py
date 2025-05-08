from django.urls import path
from .views import UserMessageView

urlpatterns = [
    path('message/', UserMessageView.as_view(), name='user-message'),
]