from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    """
    Custom permission to only allow managers to update certain fields.
    """
    def has_permission(self, request, view):
        # Only allow access to users with the 'Manager' role
        return request.user.role == 'Manager' and request.user.is_authenticated

Staff = get_user_model()

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def staff_profile(request):
    staff = request.staff
    return Response({
        "id": staff.id,
        "staffname": staff.staffname,
        "name": staff.name,  # f"{staff.first_name} {staff.last_name}".strip() or staff.staffname,
        "email": staff.email,
        "phone": getattr(staff, 'phone', ''),  # If you have this field
        "age": staff.age,
        "address": getattr(staff, 'address', ''),
        "profileImage": getattr(staff, 'profile_image', None),
        "shift": staff.shift,
        "shiftHours": staff.shiftHours,
        "status": staff.status,
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_staffs(request):
    """
    Get all staffs - accessible only by managers/admins
    """
    staffs = Staff.objects.all()
    staffs_data = [{
        "id": staff.id,
        "username": staff.username,
        "name": staff.name,
        "email": staff.email,
        "phone": getattr(staff, 'phone', ''),
        "role": staff.role,
        "age": staff.age,
        "address": getattr(staff, 'address', ''),
        "profileImage": getattr(staff, 'profile_image', None),
        "isActive": staff.is_active,
        "status": staff.status,
        "shift": staff.shift,
        "shiftHours": staff.shiftHours
    } for staff in staffs]
    
    return Response(staffs_data)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_staff_by_id(request, staff_id):
    """
    Get a specific staff by ID
    """
    try:
        staff = staff.objects.get(id=staff_id)
        return Response({
            "id": staff.id,
            "username": staff.username,
            "name": staff.name,
            "email": staff.email,
            "phone": getattr(staff, 'phone', ''),
            "role": staff.role,
            "status": staff.status,
            "shift": staff.shift,
            "shiftHours": staff.shiftHours,
            "age": staff.age,
            "address": getattr(staff, 'address', ''),
            "profileImage": getattr(staff, 'profile_image', None)
        })
    except staff.DoesNotExist:
        return Response({"detail": "staff not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsManager])
def update_staff_profile(request):
    """
    Update the current staff's profile. Only managers can update certain fields like 'shift', 'shiftHours', 'role', 'email'.
    """
    staff = request.user
    data = request.data

    # Only managers can update these fields
    if staff.role == 'Manager':
        if 'role' in data:
            staff.role = data['role']
        if 'email' in data:
            staff.email = data['email']
        if 'shift' in data:
            staff.shift = data['shift']
        if 'shiftHours' in data:
            staff.shiftHours = data['shiftHours']

    # Fields that can be updated by the staff themselves
    if 'username' in data:
        staff.username = data['username']
    if 'phone' in data:
        staff.phone = data['phone']
    if 'address' in data:
        staff.address = data['address']
    if 'profile_image' in data:
        staff.profile_image = data['profile_image']

    staff.save()

    return Response({
        "id": staff.id,
        "username": staff.username,
        "name": staff.name,
        "email": staff.email,
        "phone": getattr(staff, 'phone', ''),
        "role": staff.role,
        "shift": staff.shift,
        "shiftHours": staff.shiftHours,
        "age": staff.age,
        "address": getattr(staff, 'address', ''),
        "profileImage": getattr(staff, 'profile_image', None)
    })

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsManager])
def delete_staff(request, staff_id):
    """
    Delete a staff - accessible only by managers
    """
    try:
        staff = Staff.objects.get(id=staff_id)
        staff.delete()
        return Response({"detail": "staff deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
    except Staff.DoesNotExist:
        return Response({"detail": "staff not found"}, status=status.HTTP_404_NOT_FOUND)