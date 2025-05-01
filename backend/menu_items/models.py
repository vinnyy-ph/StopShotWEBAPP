from django.db import models

class Menu(models.Model):
    menu_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    category = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image_url = models.URLField(blank=True, null=True)
    # allergens = models.TextField(blank=True, null=True)
    # is_vegetarian = models.BooleanField(default=False)
    # is_vegan = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class MenuPromotion(models.Model):
    DISCOUNT_TYPES = (
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed'),
    )

    promotion_id = models.AutoField(primary_key=True)
    promo_code = models.CharField(max_length=100, unique=True)
    discount_type = models.CharField(max_length=10, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=6, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=True)
    image_url = models.URLField(blank=True, null=True)

    def __str__(self):
        return self.promo_code


class MenuPromotionsJunction(models.Model):
    mpj_id = models.AutoField(primary_key=True)
    promotion_id = models.ForeignKey(MenuPromotion, on_delete=models.CASCADE)
    menu_id = models.ForeignKey(Menu, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('promotion', 'menu')

    def __str__(self):
        return f"{self.menu.name} - {self.promotion.promo_code}"
