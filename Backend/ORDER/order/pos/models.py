from django.db import models
from django.contrib.auth.models import User
from customers.models import Order, FoodProduct

class PosStaff(models.Model):
    username = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True, max_length=255)
    name = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    gender = models.CharField(max_length=10, blank=True, null=True)

    def __str__(self):
        return f"POS Staff Profile: {self.user.name} ({self.role})"

class PaymentMethod(models.Model):
    name = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Transaction(models.Model):
    PAYMENT_STATUS = [
        ('PENDING', 'Pending'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded')
    ]

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='transaction')
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.PROTECT)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='PENDING')
    reference_number = models.CharField(max_length=100, unique=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transaction {self.reference_number}"

class DailyReport(models.Model):
    date = models.DateField(unique=True)
    total_sales = models.DecimalField(max_digits=10, decimal_places=2)
    total_transactions = models.IntegerField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Daily Report {self.date}"

class PosTemporarySelection(models.Model):
    STATUS_CHOICES = [
        ('SELECTED', 'Selected'),
        ('REMOVED', 'Removed'),
        ('CONFIRMED', 'Confirmed'),
    ]

    session_id = models.CharField(max_length=100)  # To track unique POS sessions
    pos_staff = models.ForeignKey(PosStaff, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodProduct, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='SELECTED')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    expires_at = models.DateTimeField()  # For cleanup of abandoned selections

    class Meta:
        db_table = 'pos_temporary_selections'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.session_id} - {self.food_item.name}"

    @property
    def is_expired(self):
        from django.utils import timezone
        return timezone.now() > self.expires_at
