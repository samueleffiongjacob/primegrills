from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, Group, Permission
from django.db import models
from django.utils import timezone

class CustomUserManager(BaseUserManager):
    """Manager for custom user model."""

    def create_user(self, username, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """Model for client users."""

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField(Group, related_name="user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="user_permissions", blank=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    class Meta:
        db_table = "client"

class StaffManager(BaseUserManager):
    """Manager for staff model."""

    def create_user(self, username, email, password=None, **extra_fields):
        """Create and return a staff user."""
        if not email:
            raise ValueError("The Email field must be set")
        if not username:
            raise ValueError("The Username field must be set")

        email = self.normalize_email(email)
        extra_fields.setdefault("is_active", True)
        
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)

class Staff(AbstractBaseUser, PermissionsMixin):
    """Model for staff users."""

    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)  # e.g., Admin, Manager, Support
    shift = models.CharField(max_length=50, blank=True, null=True)
    shiftHours = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=10, default='Inactive')

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=True)  # Staff users are always staff
    date_joined = models.DateTimeField(default=timezone.now)

    groups = models.ManyToManyField(Group, related_name="staff_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="staff_permissions", blank=True)

    objects = StaffManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return f"{self.name} ({self.role})"

    class Meta:
        db_table = "staff"