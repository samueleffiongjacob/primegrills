from django.db import models

# Create your models here.
class Orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    order_date = models.DateField()
    order_time = models.TimeField()
    order_status = models.CharField(max_length=50)
    order_total = models.DecimalField(max_digits=10, decimal_places=2)
    order_payment = models.CharField(max_length=50)
    order_customer = models.CharField(max_length=50)
    order_items = models.CharField(max_length=50)
    order_address = models.CharField(max_length=50)
    order_phone = models.CharField(max_length=50)
    order_email = models.CharField(max_length=50)
    order_note = models.CharField(max_length=50)
    order_payment_status = models.CharField(max_length=50)
    order_payment_reference = models.CharField(max_length=50)
    order_payment_processed_by = models.CharField(max_length=50)
    order_created_at = models.DateTimeField(auto_now_add=True)
    order_updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'orders'
        managed = True
        verbose_name = 'Orders'
        verbose_name_plural = 'Orders'

    def __str__(self):
        return self.order_id
