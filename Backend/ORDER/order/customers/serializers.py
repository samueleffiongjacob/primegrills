from rest_framework import serializers
from .models import Customer, FoodProduct, CustomerOrder, CustomerOrderItem

class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        extra_kwargs = {
            'email': {'required': True},  # Ensure email is required
        }

    def create(self, validated_data):
        """Create a new Customer instance."""
        email = validated_data.get('email')
        customer, created = Customer.objects.update_or_create(
            email=email,
            defaults=validated_data
        )
        return customer

class FoodProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodProduct
        fields = '__all__'

class CustomerOrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerOrderItem
        fields = '__all__'

class CustomerOrderSerializer(serializers.ModelSerializer):
    items = CustomerOrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = CustomerOrder
        fields = '__all__'
