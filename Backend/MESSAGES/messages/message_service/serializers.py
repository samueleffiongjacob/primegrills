from rest_framework import serializers
from .models import Message, Thread
from .models import User, ClientProfile, StaffProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "user_type", "created_at"]

class ClientProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = ClientProfile
        fields = ["user"]

class StaffProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = StaffProfile
        fields = ["user", "role"]

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = '__all__'

class ThreadSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Thread
        fields = '__all__'
