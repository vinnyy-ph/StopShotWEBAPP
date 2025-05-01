from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Menu, MenuPromotion, MenuPromotionsJunction
from .serializers import MenuSerializer, MenuPromotionSerializer, MenuPromotionsJunctionSerializer
from django.shortcuts import get_object_or_404


# -------- MENU --------

# RETRIEVE ALL MENU (NO AUTH NEEDED)
class MenuListAPIView(generics.ListAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

# RETRIEVE SPECIFIC MENU ITEM (NO AUTH NEEDED)
class MenuItemAPIView(generics.RetrieveAPIView):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

# CREATE SINGLE  MENU ITEM (AUTH NEEDED)
class MenuCreateAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

# UPDATE AND DELETE A SPECIFIC MENU ITEM (AUTH NEEDED)
class MenuUpdateDeleteAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer
    lookup_field = 'pk'  # pk = menu_id

# FOR DEVS ONLY
class MenuBulkCreateView(APIView):
    def post(self, request):
        serializer = MenuSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
