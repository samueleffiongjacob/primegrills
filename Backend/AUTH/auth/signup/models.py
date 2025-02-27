from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """Manager for custom user model."""

    def create_user(self, username, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError(_("The Email field must be set"))
        if not username:
            raise ValueError(_("The Username field must be set"))

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_staff", False)  # Default user is not staff
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staff(self, username, email, password=None, **extra_fields):
        """Create and return a staff user."""
        extra_fields.setdefault("is_staff", True)
        return self.create_user(username, email, password, **extra_fields)

    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(username, email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """Custom user model with different fields for customers and staff."""

    # Common fields for both user types
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    #password = models.CharField(max_length=255)  # Managed by Django’s built-in password hashing
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Fields specific to customers
    name = models.CharField(max_length=100, blank=True, null=True)

    # Fields specific to staff
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
        null=True
    )
    role = models.CharField(max_length=50, blank=True, null=True)  # e.g., Admin, Manager, Support

    # User management fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Determines if user is staff
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"  # class CustomUser(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    
    # is_active = models.BooleanField(default=True)
    # is_staff = models.BooleanField(default=False)
    
    objects = CustomUserManager()

    USERNAME_FIELD = "email"  # This ensures email is used for authentication
    REQUIRED_FIELDS = ["username"]

    """ def __str__(self):
        return self.username """

    # Return email since social login expects it
    def __str__(self):
        return self.email