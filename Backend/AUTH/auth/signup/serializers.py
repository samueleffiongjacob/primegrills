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
        
        # Create the staff profile
        StaffProfile.objects.create(user=user, **staff_profile_data)
        
        return user
    
    def update(self, instance, validated_data):
        # Handle nested staff profile data if provided
        if 'staff_profile' in validated_data:
            staff_profile_data = validated_data.pop('staff_profile')
            
            # Get or create the staff profile
            staff_profile, created = StaffProfile.objects.get_or_create(user=instance)
            
            # Update profile fields
            for attr, value in staff_profile_data.items():
                setattr(staff_profile, attr, value)
            staff_profile.save()
        
        # Update user fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

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