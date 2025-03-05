from rest_framework import serializers
from .models import Menu

class MenuSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.category_name')

    class Meta:
        model = Menu
        fields = '__all__'
