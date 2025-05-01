from rest_framework import serializers
from .models import Menu, MenuPromotion, MenuPromotionsJunction


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = '__all__'


class MenuPromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuPromotion
        fields = '__all__'


class MenuPromotionsJunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuPromotionsJunction
        fields = '__all__'
