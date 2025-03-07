from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    """
    Custom permission to only allow managers to access certain views.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_staff and
            request.user.is_superuser and
            request.user.staff_profile.role == 'Manager'
        )

class IsStaffUser(BasePermission):
    """
    Custom permission to only allow staff users to access certain views.
    """
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.is_staff and 
            request.user.staff_profile.role is not None
        )