from django.db import models
from product.services.rabbitmq_producer import send_image_to_file_manager
# Create your models here.
class Category(models.Model):
    category_name = models.CharField(max_length=255, unique=True)
    image_url = models.URLField(blank=True, null=True)  # Image stored in File Manager

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_image_to_file_manager(self.image_url)