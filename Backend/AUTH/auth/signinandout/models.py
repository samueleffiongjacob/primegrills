# models.py
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class LoginHistory(models.Model):
    ACTION_CHOICES = (
        ('login', 'Login'),
        ('logout', 'Logout'),
    )
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_history')
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    
    class Meta:
        ordering = ['-timestamp']