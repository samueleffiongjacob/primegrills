from django.db import models

# Create your models here.
class Category(models.Model):
    category_name = models.CharField(max_length=255, unique=True)
    image_url = models.URLField(blank=True, null=True)  # Image stored in File Manager

    def __str__(self):
        return self.name