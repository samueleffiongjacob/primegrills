from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import CartItem, ClientProfile, StaffProfile

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    """Base serializer for all users"""
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'phone', 'address', 'name', 'profileImage', 'user_type')
        extra_kwargs = {
            'password': {'write_only': True},
            'user_type': {'read_only': True}  # Prevent changing user type via API
        }

    def create(self, validated_data):
        # Default to client user type when creating via this serializer
        validated_data['user_type'] = 'client'
        user = User.objects.create_user(**validated_data)
        return user


class ClientProfileSerializer(serializers.ModelSerializer):
    """Serializer for client profile data"""
    class Meta:
        model = ClientProfile
        fields = ('email_verified',)


class ClientUserSerializer(UserSerializer):
    """Serializer for client users with profile data"""
    client_profile = ClientProfileSerializer(read_only=True)
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('client_profile',)
    
    def create(self, validated_data):
        validated_data['user_type'] = 'client'
        validated_data['is_active'] = False  # Require verification
        user = User.objects.create_user(**validated_data)
        return user


class StaffProfileSerializer(serializers.ModelSerializer):
    """Serializer for staff profile data"""
    class Meta:
        model = StaffProfile
        fields = ('age', 'gender', 'role', 'shift', 'shiftHours', 'status')


class StaffUserSerializer(UserSerializer):
    """Serializer for staff users with profile data"""
    staff_profile = StaffProfileSerializer()
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ('staff_profile', 'is_staff')
    
    def create(self, validated_data):
        staff_profile_data = validated_data.pop('staff_profile')
        
        # Set staff-specific attributes
        validated_data['user_type'] = 'staff'
        validated_data['is_staff'] = True
        validated_data['is_active'] = True
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Update staff profile
        for attr, value in staff_profile_data.items():
            setattr(user.staff_profile, attr, value)
        user.staff_profile.save()
        
        return user
    
    def update(self, instance, validated_data):
        # Handle nested staff profile data if provided
        if 'staff_profile' in validated_data:
            staff_profile_data = validated_data.pop('staff_profile')
            
            for attr, value in staff_profile_data.items():
                setattr(instance.staff_profile, attr, value)
            instance.staff_profile.save()
        
        # Update user fields
        return super().update(instance, validated_data)


class CartItemSerializer(serializers.ModelSerializer):
    """Serializer for user's cart items"""
    class Meta:
        model = CartItem
        fields = ["id", "product_id", "name", "price", "quantity", "image"]
        
    def create(self, validated_data):
        # The view should set the user from request.user
        user = self.context.get('request').user
        validated_data['user'] = user
        return super().create(validated_data)