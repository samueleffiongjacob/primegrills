from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
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
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsStaffUser])
def update_staff_profile(request):
    """
    Update the current staff's profile - Manual Update Version
    """
    staff = request.user
    data = request.data
    
    # Define which fields belong to which model
    user_fields = ['username','phone', 'address']
    profile_fields = ['status']
    
    # Update User model fields
    user_updated = False
    for field in user_fields:
        if field in data:
            setattr(staff, field, data[field])
            user_updated = True
    
    if user_updated:
        staff.save()
    
    # Update StaffProfile fields
    profile_updated = False
    try:
        profile = staff.staff_profile
    except StaffProfile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = StaffProfile(user=staff)
    
    if 'staff_profile' in data:
        for field in profile_fields:
            if field in data['staff_profile']:
                setattr(profile, field, data['staff_profile'][field])
    
    if profile_updated:
        profile.save()
    
    # Return the updated user data
    response_data = {
        'id': staff.id,
        'username': staff.username,
        'email': staff.email,
        'name': staff.name,
        'phone': staff.phone,
        'address': staff.address,
        'user_type': staff.user_type,
        'is_staff': staff.is_staff,
        'staff_profile': {
            'age': profile.age,
            'gender': profile.gender,
            'role': profile.role,
            'shift': profile.shift,
            'shiftHours': profile.shiftHours,
            'status': profile.status
        }
    }
    print(response_data)
    return Response(response_data)


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