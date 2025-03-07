from django.db import models
from category.models import Category # FROM CATEGORY

# Create your models here.
class Menu(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="menus")
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # Add default value
    image_data = models.BinaryField(blank=True, null=True)
    quantity = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

    @property
    def status(self):
        return "Available" if self.quantity > 0 else "Out of Stock"
