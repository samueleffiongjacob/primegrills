from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    """
    Custom permission to only allow managers to access certain views.
    """
    def has_permission(self, request, view):
        # Check if the user is authenticated
        if not request.user.is_authenticated:
            return False

        # Check if the user is a superuser (managers should be superusers)
        if getattr(request.user, 'is_superuser', False):
            return True

        # Check if the user is a staff member
        if not getattr(request.user, 'is_staff', False):
            return False

        # Check if the user has a staff profile and the role is set
        if not hasattr(request.user, 'staff_profile'):
            return False

        # Check if the user's role is 'Manager'
        return getattr(request.user.staff_profile, 'role', None) == 'Manager'
    
class IsStaffUser(BasePermission):
    """
    Custom permission to only allow staff users to access certain views.
    """
    def has_permission(self, request, view):
        is_authenticated = request.user.is_authenticated
        is_staff = getattr(request.user, 'is_staff', False)
        
        # Check for superuser first (managers should be superusers)
        if is_authenticated and getattr(request.user, 'is_superuser', False):
            return True
            
        # More detailed checks for regular staff
        has_profile = hasattr(request.user, 'staff_profile')
        
        if has_profile:
            has_role = getattr(request.user.staff_profile, 'role', None) is not None
        else:
            has_role = False
            
        # For debugging
        print(f"Auth check: authenticated={is_authenticated}, staff={is_staff}, "
              f"has_profile={has_profile}, has_role={has_role}")
              
        return is_authenticated and is_staff and has_role

