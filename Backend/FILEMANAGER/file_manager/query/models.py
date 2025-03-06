from django.db import models

# Create your models here.
class QueryCategoryImage(models.Model):
    """Stores Category images separately for faster access."""
    category_id = models.IntegerField(unique=True)
    image_url = models.URLField()

class QueryMenuImage(models.Model):
    """Stores Menu images separately for faster access."""
    menu_id = models.IntegerField(unique=True)
    image_url = models.URLField()
