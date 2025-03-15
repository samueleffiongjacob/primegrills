from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    username = models.CharField(max_length=100)
    phone = models.CharField(max_length=15)
    address = models.TextField()
    profileImage = models.ImageField(upload_to='profile_images/', blank=True, null=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip = models.CharField(max_length=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['created_at']

class FoodProduct(models.Model):
    name = models.CharField(max_length=100)
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    description = models.TextField()
    category = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class CustomerOrder(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PREPARING', 'Preparing'),
        ('READY', 'Ready for Pickup'),
        ('DELIVERED', 'Delivered'),
        ('CANCELLED', 'Cancelled'),
    ]

    PAY_STATS = [
        ('PENDING', 'pending'),
        ('PAID', 'paid'),
        ('FAILED', 'cancelled'),
    ]
    
    order_id = models.CharField(max_length=20, unique=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='customer_order')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    payment = models.CharField(max_length=20, choices=PAY_STATS, default='PENDING')
    special_instructions = models.TextField(blank=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order #{self.id} - {self.customer.name}"
    
    class Meta:
        ordering = ['created_at']

class CustomerOrderItem(models.Model):
    order = models.ForeignKey(CustomerOrder, on_delete=models.CASCADE, related_name='items')
    food_product = models.ForeignKey(FoodProduct, on_delete=models.SET_NULL, null=True)
    quantity = models.PositiveIntegerField()
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    def save(self, *args, **kwargs):
        self.subtotal = self.quantity * self.price_at_time
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity}x {self.food_product.name}"


