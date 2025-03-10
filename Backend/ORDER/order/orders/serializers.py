from rest_framework import serializers
from .models import Orders
from customers.models import Customer

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'
        

class OrderItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'