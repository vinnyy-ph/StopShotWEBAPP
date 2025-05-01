# myapp/urls.py

from django.urls import path
from .views import (
    MenuListCreateView, MenuRetrieveUpdateDestroyView,
    PromotionListCreateView, PromotionRetrieveUpdateDestroyView,
    MenuPromotionLinkListCreateView, MenuPromotionLinkRetrieveUpdateDestroyView,
)

urlpatterns = [
    # Menu URLs
    path('menus/', MenuListCreateView.as_view(), name='menu-list-create'),
    path('menus/<int:pk>/', MenuRetrieveUpdateDestroyView.as_view(), name='menu-detail'),

    # Promotion URLs
    path('promotions/', PromotionListCreateView.as_view(), name='promotion-list-create'),
    path('promotions/<int:pk>/', PromotionRetrieveUpdateDestroyView.as_view(), name='promotion-detail'),

    # MenuPromotionLink (junction table) URLs
    path('promotion-links/', MenuPromotionLinkListCreateView.as_view(), name='promotion-link-list-create'),
    path('promotion-links/<int:pk>/', MenuPromotionLinkRetrieveUpdateDestroyView.as_view(), name='promotion-link-detail'),
]
