from django.db import models
from category.models import Category # FROM CATEGORY
from service.rabbitmq_producer import send_image_to_event_service



# Create your models here.
class Menu(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    image_url = models.URLField(blank=True, null=True)  # Image from File Manager
    status = models.CharField(max_length=50, default='available')
    quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        send_image_to_event_service(self.image_url)