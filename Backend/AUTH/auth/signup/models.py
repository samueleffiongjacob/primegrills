from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
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

    def create_superuser(self, username, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("user_type", "staff")

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    """Base user model for all types of users."""
    
    USER_TYPES = (
        ('client', 'Client'),
        ('staff', 'Staff'),
    )
    
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='client')
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    class Meta:
        db_table = "users"


class ClientProfile(models.Model):
    """Extended profile for client users."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client_profile')
    # Add client-specific fields here
    email_verified = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Client Profile: {self.user.email}"
    
    class Meta:
        db_table = "client_profiles"


class StaffProfile(models.Model):
    """Extended profile for staff users."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='staff_profile')
    # Staff-specific fields
    age = models.PositiveIntegerField(blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)  # e.g., Admin, Manager, Support
    shift = models.CharField(max_length=50, blank=True, null=True)
    shiftHours = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=10, default='Inactive')
    
    def __str__(self):
        return f"Staff Profile: {self.user.name} ({self.role})"
    
    class Meta:
        db_table = "staff_profiles"


class CartItem(models.Model):
    """Cart model for client users."""
    user = models.ForeignKey(User, related_name="cart_items", on_delete=models.CASCADE)
    product_id = models.IntegerField()
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    image = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} (x{self.quantity})"
        
    class Meta:
        db_table = "cart_items"