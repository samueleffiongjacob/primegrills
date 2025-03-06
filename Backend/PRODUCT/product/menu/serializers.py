import base64
from rest_framework import serializers
from .models import Menu

class MenuSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source="category.name")
    image_base64 = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = ["id", "category", "category_name", "name", "description", "price", "image_base64", "quantity", "status"]

    def get_image_base64(self, obj):
        """Convert binary image data to Base64 string."""
        if obj.image_data:
            return base64.b64encode(obj.image_data).decode("utf-8")
        return None

    def create(self, validated_data):
        """Handle image data if provided as Base64."""
        image_base64 = self.initial_data.get("image_base64")
        if image_base64:
            validated_data["image_data"] = base64.b64decode(image_base64)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        """Handle updating image data if provided as Base64."""
        image_base64 = self.initial_data.get("image_base64")
        if image_base64:
            validated_data["image_data"] = base64.b64decode(image_base64)
        return super().update(instance, validated_data)
