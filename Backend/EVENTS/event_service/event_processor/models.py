from django.db import models

class AuthEvent(models.Model):
    event_type = models.CharField(max_length=255)
    event_data = models.JSONField()
    timestamp = models.DateTimeField()

    def __str__(self):
        return f"{self.event_type} - {self.timestamp}"
    
   
