# Custom Authentication Backend (for email or username login)
from django.contrib.auth.backends import ModelBackend
from .models import User

class EmailOrUsernameBackend(ModelBackend):
    """Allow users to login with either email or username."""
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            user = User.objects.get(email=username) if "@" in username else User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        
        if user and user.check_password(password):
            return user
        return None
