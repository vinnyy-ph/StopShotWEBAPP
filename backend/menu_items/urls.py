# myapp/urls.py

from django.urls import path
from .views import (
    MenuListCreateAPIView, MenuRetrieveUpdateDeleteAPIView, MenuBulkCreateView,
    PromotionListCreateAPIView, PromotionRetrieveUpdateDeleteAPIView,
    PromotionMenuLinkCreateAPIView, PromotionMenuLinkListAPIView,
)

urlpatterns = [
    # Menu URLs
    path('menus/', MenuListCreateAPIView.as_view(), name='menu-list-create'),
    path('menus/<int:pk>/', MenuRetrieveUpdateDeleteAPIView.as_view(), name='menu-detail'),
    path('menus/bulk-create/', MenuBulkCreateView.as_view(), name='menu-bulk-create'),

    # Promotion URLs
    path('promotions/', PromotionListCreateAPIView.as_view(), name='promotion-list-create'),
    path('promotions/<int:pk>/', PromotionRetrieveUpdateDeleteAPIView.as_view(), name='promotion-detail'),

    # MenuPromotionLink (junction table) URLs
    path('promotion-links/', PromotionMenuLinkCreateAPIView.as_view(), name='promotion-link-list-create'),
    path('promotion-links/<int:pk>/', PromotionMenuLinkListAPIView.as_view(), name='promotion-link-detail'),
]
