from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ReservationViewSet, DailyAvailabilitySummaryView

router = DefaultRouter()
router.register(r'reservations', ReservationViewSet, basename='reservation')

urlpatterns = [
    path('', include(router.urls)),
    path('availability/summary/', DailyAvailabilitySummaryView.as_view(), name='availability-summary'),
]