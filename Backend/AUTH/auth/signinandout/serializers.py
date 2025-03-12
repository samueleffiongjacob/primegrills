# serializers.py
from rest_framework import serializers
from .models import LoginHistory

class LoginHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LoginHistory
        fields = ['id', 'user_id', 'timestamp', 'action']