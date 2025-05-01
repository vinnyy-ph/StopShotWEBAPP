from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Menu, MenuPromotion, MenuPromotionsJunction
from .serializers import MenuSerializer, MenuPromotionSerializer, MenuPromotionsJunctionSerializer
from django.shortcuts import get_object_or_404


# -------- MENU --------

class MenuListCreateAPIView(generics.ListCreateAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer


class MenuRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    lookup_field = 'pk'  # pk = menu_id


# -------- PROMOTION --------

class PromotionListCreateAPIView(generics.ListCreateAPIView):
    queryset = MenuPromotion.objects.all()
    serializer_class = MenuPromotionSerializer


class PromotionRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuPromotion.objects.all()
    serializer_class = MenuPromotionSerializer
    lookup_field = 'pk'  # pk = promotion_id


# -------- JUNCTION TABLE --------

class PromotionMenuLinkCreateAPIView(generics.CreateAPIView):
    queryset = MenuPromotionsJunction.objects.all()
    serializer_class = MenuPromotionsJunctionSerializer


class PromotionMenuLinkListAPIView(generics.ListAPIView):
    queryset = MenuPromotionsJunction.objects.all()
    serializer_class = MenuPromotionsJunctionSerializer


class PromotionMenuLinkRetrieveUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MenuPromotionsJunction.objects.all()
    serializer_class = MenuPromotionsJunctionSerializer
    lookup_field = 'pk'  # pk = mpj_id
