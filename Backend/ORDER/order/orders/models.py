from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from customers.models import Customer, FoodProduct
from pos.models import PosStaff

class Orders(models.Model):
    PAY_STATS = [
        ('PENDING', 'pending'),
        ('complete', 'complete'),
        ('cancelled', 'cancelled'),
    ]

    id = models.AutoField(primary_key=True)
    content_type = models.ForeignKey(
        ContentType,
        on_delete=models.CASCADE,
        limit_choices_to={'model__in': ('customer', 'posstaff')}
    )
    object_id = models.PositiveIntegerField()
    user = GenericForeignKey('content_type', 'object_id')
    order_id = models.CharField(max_length=20, unique=True)
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=50, choices=PAY_STATS, default="PENDING")
    total = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        managed = True
        verbose_name = 'Orders'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return self.order_id
    
class OrderItems(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='items')
    food_product = models.ForeignKey(FoodProduct, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    image = models.URLField(blank=True, null=True)
