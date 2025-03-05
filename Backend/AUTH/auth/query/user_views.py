from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "name": user.name,  # f"{user.first_name} {user.last_name}".strip() or user.username,
        "email": user.email,
        "phone": getattr(user, 'phone', ''),  # If you have this field
        "memberSince": user.date_joined.strftime("%B %Y"),  # Format as "January 2025"
        "address": getattr(user, 'address', ''),
        "profileImage": getattr(user, 'profile_image', None)
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_users(request):
    """
    Get all users - accessible only by managers
    """
    users = User.objects.all()
    users_data = [{
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, 'phone', ''),
        "memberSince": user.date_joined.strftime("%B %Y"),
        "address": getattr(user, 'address', ''),
        "profileImage": getattr(user, 'profile_image', None),
        "isActive": user.is_active
    } for user in users]
    
    return Response(users_data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    """
    Get a specific user by ID
    """
    try:
        user = User.objects.get(id=user_id)
        return Response({
            "id": user.id,
            "username": user.username,
            "name": user.name,
            "email": user.email,
            "phone": getattr(user, 'phone', ''),
            "memberSince": user.date_joined.strftime("%B %Y"),
            "address": getattr(user, 'address', ''),
            "profileImage": getattr(user, 'profile_image', None)
        })
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update the current user's profile
    """
    user = request.user
    data = request.data
    
    # Update fields
    if 'name' in data:
        user.name = data['name']
    if 'email' in data:
        user.email = data['email']
    if 'phone' in data:
        user.phone = data['phone']
    if 'address' in data:
        user.address = data['address']
    if 'profile_image' in data:
        user.profile_image = data['profile_image']
    
    user.save()
    
    return Response({
        "id": user.id,
        "username": user.username,
        "name": user.name,
        "email": user.email,
        "phone": getattr(user, 'phone', ''),
        "memberSince": user.date_joined.strftime("%B %Y"),
        "address": getattr(user, 'address', ''),
        "profileImage": getattr(user, 'profile_image', None)
    })

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    """
    Delete a user - accessible only by managers/admins
    """
    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)