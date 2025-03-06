from rest_framework import serializers
from models import QueryCategory, QueryMenu

class QueryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryCategory
        fields = "__all__"

class QueryMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = QueryMenu
        fields = "__all__"
