# myapp/urls.py

from django.urls import path
from .views import (
    MenuListAPIView, MenuItemAPIView, MenuCreateAPIView, MenuUpdateDeleteAPIView, MenuBulkCreateView,
    PromotionListCreateAPIView, PromotionRetrieveUpdateDeleteAPIView,
    PromotionMenuLinkCreateAPIView, PromotionMenuLinkListAPIView,
)

urlpatterns = [
    # Menu URLs
    path('menus/list', MenuListAPIView.as_view(), name='menu-list'), # List of All Menu Items
    path('menus/item/<int:pk>', MenuItemAPIView.as_view(), name='menu-item'), # Retrieve Specific Menu Item
    path('menus/create', MenuCreateAPIView.as_view(), name='menu-create'), # Create a single menu item
    path('menus/bulk-create/', MenuBulkCreateView.as_view(), name='menu-bulk-create'), # Create a multiple menu item
    path('menus/<int:pk>/', MenuUpdateDeleteAPIView.as_view(), name='menu-detail'), # Update - Delete Function for Menu Items
    

    # Promotion URLs
    path('promotions/', PromotionListCreateAPIView.as_view(), name='promotion-list-create'),
    path('promotions/<int:pk>/', PromotionRetrieveUpdateDeleteAPIView.as_view(), name='promotion-detail'),

    # MenuPromotionLink (junction table) URLs
    path('promotion-links/', PromotionMenuLinkCreateAPIView.as_view(), name='promotion-link-list-create'),
    path('promotion-links/<int:pk>/', PromotionMenuLinkListAPIView.as_view(), name='promotion-link-detail'),
]
