from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from signup.serializers import CartItemSerializer, ClientUserSerializer # serializer for CartItem
from .permissions import IsManager, IsStaffUser



User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """
    Get the current user's profile.
    """
    user = request.user
    serializer = ClientUserSerializer(user)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_cart(request):
    """
    Get the current user's cart items.
    """
    user = request.user

    try:
        # Fetch cart items for the user
        cart_items = user.cart_items.all()
        serializer = CartItemSerializer(cart_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsManager])
def get_all_users(request):
    """
    Get all users - accessible only by managers
    """
    users = User.objects.filter(user_type='client')  # Filter only client users
    serializer = ClientUserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_by_id(request, user_id):
    """
    Get a user by ID.
    """
    try:
        user = User.objects.get(id=user_id, user_type='client')  # Filter by user_type
        serializer = ClientUserSerializer(user)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update the current user's profile
    """
    user = request.user
    serializer = ClientUserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    """
    Upload a profile image for the authenticated user.
    """
    user = request.user
    print(user)

    # Check if a file is included in the request
    if "profileImage" not in request.FILES:
        return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

    # Get the uploaded file
    profile_image = request.FILES["profileImage"]

    # Update the user's profileImage field
    user.profileImage = profile_image
    user.save()

    return Response({"message": "Profile image updated successfully"}, status=status.HTTP_200_OK)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_cart(request):
    """
    Update the current user's cart items.
    Expects a list of cart items in the request data.
    """
    user = request.user
    cart_items_data = request.data.get("cartItems", [])

    # Validate and update cart items
    try:
        # Clear existing cart items for the user
        user.cart_items.all().delete()

        # Add new cart items
        for item_data in cart_items_data:
            serializer = CartItemSerializer(data=item_data)
            if serializer.is_valid():
                serializer.save(user=user)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Fetch updated cart items
        updated_cart_items = user.cart_items.all()
        serializer = CartItemSerializer(updated_cart_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsManager])
def delete_user(request, user_id):
    """
    Delete a user - accessible only by managers/admins
    """
    try:
        user = User.objects.get(id=user_id, user_type='client')  # Filter by user_type
        user.delete()
        return Response({"detail": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)