from django.core.validators import RegexValidator
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

# Create your models here.

# Phone number validator (allows +234, 080,)
phone_validator = RegexValidator(
    regex=r'^\+?\d{10,15}$',  # Allows +, followed by 10-15 digits
    message="Phone number must be numeric and 10-15 digits long"
)

# Custom User Manager
class UserManager(BaseUserManager):
    def create_user(self, email, name,phone, password=None, **extra_fields):
        if not name:
            raise ValueError("The name field must be set")
        if not email:
            raise ValueError("The Email field must be set")
        if not phone:
            raise ValueError("The Phone field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name,phone, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name,phone, password, **extra_fields)

# User Model
class User(AbstractBaseUser):
    name = models.CharField(max_length=100)
    username = models.CharField(max_length=100, unique=True, default="default_user")
    email = models.EmailField(unique=True)

    phone =  models.CharField(max_length=16, unique=True, validators=[phone_validator], default="0000000000")

    ssn = models.CharField(max_length=16, blank=True, null=True)
    ip = models.GenericIPAddressField(blank=True, null=True) # Automatically set during registration
    last_login = models.DateTimeField(auto_now=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True) # Stores browser details
    created_at = models.DateTimeField(auto_now_add=True)

    objects = UserManager()
    USERNAME_FIELD = 'email'  # Primary identifier
    REQUIRED_FIELDS = ['name', 'phone']

    def __str__(self):
        return self.email

# Login Model
class Login(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    login_time = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True)

# OAuth Providers
class OAuthProvider(models.Model):
    provider_name = models.CharField(max_length=50, unique=True)

# OAuth Accounts
class OAuthAccount(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    provider = models.ForeignKey(OAuthProvider, on_delete=models.CASCADE)
    provider_user_id = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
