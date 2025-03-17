from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.contrib.auth.hashers import check_password
from .permissions import IsStaffUser, IsManager
from signup.serializers import  StaffUserSerializer
from signup.models import StaffProfile
User = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStaffUser])
def staff_profile(request):
    """
    Get the current staff's profile.
    """
    staff = request.user
    print(staff)
    serializer = StaffUserSerializer(staff)
    return Response(serializer.data)


@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStaffUser])
def get_all_staffs(request):
    """
    Get all users - accessible only by all staff
    """
    print(request.user.is_authenticated)
    staffs = User.objects.filter(user_type='staff').select_related('staff_profile')  # Filter only staff users
    serializer = StaffUserSerializer(staffs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStaffUser])
def get_staff_by_id(request, staff_id):
    """
    Get a staff by ID.
    """
    try:
        staff = User.objects.get(id=staff_id, user_type='staff')
        serializer = StaffUserSerializer(staff)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({"detail": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
    

from signup.se import StaffProfileSerializer, RegisterStaffSerializer

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_staff_profile(request):
    """
    Endpoint for updating the user's profile.
    """
    user = request.user
    data = request.data

    if 'username' in data:
        if User.objects.filter(username=data["username"]).exists():
            return Response({"error": "Username already exists"}, status=400)

    # Use UserSerializer to update user fields
    user_serializer = StaffUserSerializer(user, data=data, partial=True)
    if not user_serializer.is_valid():
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Save user updates
    user_serializer.save()

    # Update StaffProfile if the user is a staff member
    if user.user_type == "staff":
        try:
            profile = user.staff_profile
        except StaffProfile.DoesNotExist:
            profile = StaffProfile(user=user)

        profile_serializer = StaffProfileSerializer(profile, data=data.get("staff_profile", {}), partial=True)
        if not profile_serializer.is_valid():
            return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        profile_serializer.save()

    # Return the updated user data
    response_data = user_serializer.data
    if user.user_type == "staff":
        response_data["staff_profile"] = profile_serializer.data

    return Response(response_data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsStaffUser])
def update_staff_password(request):
    """
    Update the current staff's password
    """
    staff = request.user
    data = request.data
    print(data)
    # Check if required fields are provided
    if 'currentPassword' not in data or 'newPassword' not in data:
        return Response(
            {"error": "Both current password and new password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    current_password = data['currentPassword']
    new_password = data['newPassword']

    # Check if the current password is correct
    if not check_password(current_password, staff.password):
        return Response(
            {"error": "Current password is incorrect."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Validate the new password
    if len(new_password) < 6:  
        return Response(
            {"error": "New password must be at least 6 characters long."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Update the password
    staff.set_password(new_password)
    staff.save()   

    return Response({"success": "Password changed successfully"}, status=status.HTTP_200_OK)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsManager])
def delete_staff(request, staff_id):
    """
    Delete a staff - accessible only by managers
    """
    try:
        staff = User.objects.get(id=staff_id, user_type='staff')  # Filter by user_type
        staff.delete()
        return Response({"detail": "Staff deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"detail": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsManager])
def manager_update_staff(request, user_id):
    """
    Simplified view to update staff profile by managers only.
    """
  
    # Fetch the staff user or return 404 if not found
    staff = get_object_or_404(User, id=user_id, user_type='staff')

    # Extract data from the request
    data = request.data

    # Update user fields if provided
    user_fields = ['name', 'phone', 'address']
    for field in user_fields:
        if field in data:
            print(data[field])
            setattr(staff, field, data[field])


    # Update staff profile fields if provided
    profile_fields = ['role', 'status', 'shift', 'shiftHours', 'gender', 'age']
    try:
        profile = staff.staff_profile
    except StaffProfile.DoesNotExist:
        profile = StaffProfile(user=staff)  # Create profile if it doesn't exist

    if 'staff_profile' in data:
        for field in profile_fields:
            if field in data['staff_profile']:
                setattr(profile, field, data['staff_profile'][field])


    # Save changes
    staff.save()
    profile.save()

    # Return updated data
    response_data = {
        'id': staff.id,
        'name': staff.name,
        'phone': staff.phone,
        'address': staff.address,
        'staff_profile': {
            'role': profile.role,
            'status': profile.status,
            'shift': profile.shift,
            'shiftHours': profile.shiftHours,
            'gender': profile.gender,
            'age': profile.age,
        }
    }

    return Response(response_data, status=status.HTTP_200_OK)