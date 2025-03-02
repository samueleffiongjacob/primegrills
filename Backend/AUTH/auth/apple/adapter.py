# apple/adapter.py
from auth.adapters import BaseSocialAccountAdapter

class AppleSocialAccountAdapter(BaseSocialAccountAdapter):
    """Apple-specific social account adapter."""
    
    def populate_user(self, request, sociallogin, data):
        """
        Populate user with data from Apple.
        """
        user = super().populate_user(request, sociallogin, data)
        
        # Set username if not set - Apple might not provide much info
        if not user.username:
            user.username = f"apple_{sociallogin.account.uid[:10]}"
        
        # Apple doesn't always provide name information
        if 'name' in data:
            if 'firstName' in data['name']:
                user.first_name = data['name']['firstName']
            if 'lastName' in data['name']:
                user.last_name = data['name']['lastName']
            
            # For customer users, set the name field
            if not user.is_staff and user.first_name and user.last_name:
                user.name = f"{user.first_name} {user.last_name}"
        
        return user