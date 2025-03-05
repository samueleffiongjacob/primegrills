from django.db import models
from category.models import Category # FROM CATEGORY

# Create your models here.
class Menu(models.Model):
    category_name = models.ForeignKey(Category, on_delete=models.CASCADE)
    menu_name = models.CharField(max_length=255)
    image_url = models.URLField(blank=True, null=True)  # Image from File Manager
    status = models.CharField(max_length=50, default='available')
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name