from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=255, unique=True)
    # image = models.ImageField(upload_to='categories/',blank=True, null=True)  # Image stored in File Manager
    image_data = models.BinaryField(blank=True, null=True)
    def __str__(self):
        return self.name
