from rest_framework import serializers
from .models import PaymentMethod, Transaction, DailyReport, PosStaff, PosTemporarySelection
from customers.serializers import FoodProductSerializer

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = '__all__'
        read_only_fields = ('reference_number', 'processed_by')

class DailyReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyReport
        fields = '__all__'
        read_only_fields = ('created_by',)

class PosStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosStaff
        fields = '__all__'

class PosTemporarySelectionSerializer(serializers.ModelSerializer):
    food_item_details = FoodProductSerializer(source='food_item', read_only=True)

    class Meta:
        model = PosTemporarySelection
        fields = '__all__'
        read_only_fields = ('expires_at',)
