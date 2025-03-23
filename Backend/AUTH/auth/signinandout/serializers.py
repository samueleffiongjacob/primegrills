# serializers.py
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import LoginHistory

class LoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginHistory
        fields = ['id', 'user_id', 'timestamp', 'action']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # Add custom fields to the token
        data["email"] = user.email
        data["role"] = user.staff_profile.role if hasattr(user, "staff_profile") else None
        data["status"] = user.staff_profile.status if hasattr(user, "staff_profile") else None

        return data
