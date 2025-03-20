from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

class User(AbstractBaseUser):
    """Base user model for all types of users."""
    
    USER_TYPES = (
        ('client', 'Client'),
        ('staff', 'Staff'),
    )
    

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255, null=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='client')
    created_at = models.DateTimeField(auto_now_add=True) 

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    class Meta:
        db_table = "users"


class ClientProfile(models.Model):
    """Extended profile for client users."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    
    def __str__(self):
        return f"Client Profile: {self.user.username}"
    
    class Meta:
        db_table = "client_profiles"


class StaffProfile(models.Model):
    """Extended profile for staff users."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    role = models.CharField(max_length=50, blank=True, null=True)  # e.g., Admin, Manager, Support
    
    def __str__(self):
        return f"Staff Profile: {self.user.username} ({self.role})"
    
    class Meta:
        db_table = "staff_profiles"



class Thread(models.Model):
    participants = models.ManyToManyField(User, related_name="threads")
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_messages")
    thread = models.ForeignKey(Thread, on_delete=models.CASCADE, related_name="messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']
