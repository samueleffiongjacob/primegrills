import base64
from rest_framework import serializers
from .models import Category

class CategorySerializer(serializers.ModelSerializer):
    image_data = serializers.CharField(write_only=True, required=False)  # Accepts base64 image string

    class Meta:
        model = Category
        fields = ['id', 'name', 'image_data']

    def create(self, validated_data):
        """Convert base64 image to binary before saving"""
        image_base64 = validated_data.pop('image_data', None)
        if image_base64:
            validated_data['image_data'] = base64.b64decode(image_base64)
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        """Handle updating image data if provided as Base64."""
        image_base64 = self.initial_data.get("image_base64")
        if image_base64:
            validated_data["image_data"] = base64.b64decode(image_base64)
        return super().update(instance, validated_data)


    def to_representation(self, instance):
        """Convert binary data to base64 string when retrieving"""
        representation = super().to_representation(instance)
        if instance.image_data:
            representation['image_data'] = base64.b64encode(instance.image_data).decode('utf-8')
        return representation
