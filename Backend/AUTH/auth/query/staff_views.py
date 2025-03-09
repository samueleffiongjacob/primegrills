from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .permissions import IsStaffUser, IsManager
from signup.serializers import  StaffUserSerializer
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
def get_all_staffs(request):
    """
    Get all users - accessible only by all staff
    """
    print(request.user)
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
    Update the current staff's profile
    """
    
    
    staff = request.user
    data = request.data
    
    # Separate user and profile data
    profile_fields = ['age', 'gender', 'role', 'shift', 'shiftHours', 'status']
    profile_data = {}
    
    # Extract profile data if present
    for field in profile_fields:
        if field in data:
            profile_data[field] = data.pop(field)
    
    # If profile data exists, add it in the expected format for the serializer
    if profile_data:
        data['staff_profile'] = profile_data
    
    serializer = StaffUserSerializer.update(staff, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def manager_update_staff(request, staff_id):
    """
    Allow managers to update other staff profiles
    """
    print(request)
    if not request.user.is_authenticated:
        return Response({"error": "Authentication required"}, status=401)
        
    if request.user.user_type != 'staff' or request.user.staff_profile.role != 'Manager':
        return Response({"error": "Manager access only"}, status=403)
    data = request.data
    print(data)
    staff_id = request.data.id
    try:
        staff = User.objects.get(id=staff_id, user_type='staff')
    except User.DoesNotExist:
        return Response({"error": "Staff not found"}, status=404)
    
    data = request.data
    
    # Separate user and profile data
    profile_fields = ['age', 'gender', 'role', 'shift', 'shiftHours', 'status']
    profile_data = {}
    
    print(data)
    # Extract profile data if present
    for field in profile_fields:
        if field in data.staff_profile:
            print(data.staff_profile.pop(field))
            profile_data[field] = data.pop(field)
    
    # If profile data exists, add it in the expected format for the serializer
    if profile_data:
        data['staff_profile'] = profile_data
    
    serializer = StaffUserSerializer.update(staff, data=data, partial=True)
    print(serializer)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    else:
        print("Validation errors:", serializer.errors)  # Debug
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsManager])
def delete_staff(request, staff_id):
    """
    Delete a staff - accessible only by managers
    """
     # Check if user has admin permissions
    if not request.user.is_authenticated and request.user.user_type != 'staff' and request.user.staff_profile.role != 'Manager':
        return Response({"error": "You don't have permission to register staff members"}, status=403)
    try:
        staff = User.objects.get(id=staff_id, user_type='staff')  # Filter by user_type
        staff.delete()
        return Response({"detail": "Staff deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except User.DoesNotExist:
        return Response({"detail": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)