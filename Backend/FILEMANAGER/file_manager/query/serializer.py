from rest_framework import serializers
from .models import QueryCategoryImage, QueryMenuImage

class QueryCategoryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryCategoryImage
        fields = "__all__"

class QueryMenuImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryMenuImage
        fields = "__all__"
