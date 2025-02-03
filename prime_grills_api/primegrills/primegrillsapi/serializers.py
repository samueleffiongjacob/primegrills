from rest_framework import serializers
from .models import User, Login, OAuthProvider, OAuthAccount

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

# Login Serializer
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = '__all__'

# OAuth Provider Serializer
class OAuthProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = OAuthProvider
        fields = '__all__'

# OAuth Account Serializer
class OAuthAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = OAuthAccount
        fields = '__all__'

