from rest_framework import serializers
from .models import User, ClientProfile, StaffProfile
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the User model."""

    class Meta:
        model = User
        fields = ["id", "username", "email", "name", "phone", "address", "profileImage", "user_type", "is_active"]


class StaffProfileSerializer(serializers.ModelSerializer):
    """Serializer for Staff Profile."""
    
    class Meta:
        model = StaffProfile
        fields = ["age", "gender", "role", "shift", "shiftHours", "status"]

class RegisterStaffSerializer(serializers.ModelSerializer):
    """Serializer for staff registration, linking the staff profile."""

    staff_profile = StaffProfileSerializer()
    profileImage = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["username", "email", "password", "name", "phone", "address", "profileImage", "user_type", "staff_profile"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        staff_profile_data = validated_data.pop("staff_profile", None)
        validated_data["user_type"] = "staff"  # Ensure user_type is 'staff'
        validated_data["is_staff"] = True
        validated_data["is_active"] = True  # Automatically activate staff users

        user = User.objects.create_user(**validated_data)

        # Create staff profile if provided
        if staff_profile_data:
            StaffProfile.objects.create(user=user, **staff_profile_data)

        return user
    
    
    def get_profileImage(self, obj):
        if obj.profileImage:
            return f"{settings.BASE_URL}{obj.profileImage.url}"
        return None
