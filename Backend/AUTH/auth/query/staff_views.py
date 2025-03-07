from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .permissions import IsStaffUser, IsManager
from signup.serializers import  StaffUserSerializer
User = get_user_model

Staff = get_user_model()

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
    staffs = Staff.objects.filter(user_type='staff')  # Filter only staff users
    serializer = StaffUserSerializer(staffs, many=True)
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsStaffUser])
def get_staff_by_id(request, staff_id):
    """
    Get a staff by ID.
    """
    try:
        staff = Staff.objects.get(id=staff_id)
        serializer = StaffUserSerializer(staff)
        return Response(serializer.data)
    except Staff.DoesNotExist:
        return Response({"detail": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsManager])
def update_staff_profile(request):
    """
    Update the current staff's profile
    """
    staff = request.user
    serializer = StaffUserSerializer(staff, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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