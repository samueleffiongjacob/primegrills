from django.db import models

# Create your models here.
class QueryCategory(models.Model):
    """Stores pre-fetched Category data for faster queries."""
    category_id = models.IntegerField(unique=True)
    category_name = models.CharField(max_length=255)
    image_url = models.URLField()

class QueryMenu(models.Model):
    """Stores pre-fetched Menu data for faster queries."""
    menu_id = models.IntegerField(unique=True)
    category_id = models.IntegerField()
    category_name = models.CharField(max_length=255)
    menu_name = models.CharField(max_length=255)
    image_url = models.URLField()
    status = models.CharField(max_length=50)
    quantity = models.IntegerField()
