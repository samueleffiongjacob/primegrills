# google/adapter.py
from auth.adapters import BaseSocialAccountAdapter

class GoogleSocialAccountAdapter(BaseSocialAccountAdapter):
    """Google-specific social account adapter."""
    
    def populate_user(self, request, sociallogin, data):
        """
        Populate user with data from Google.
        """
        user = super().populate_user(request, sociallogin, data)
        
        # Set username if not set
        if not user.username:
            user.username = data.get('email', '').split('@')[0]
        
        # Set names from Google data
        user.first_name = data.get('given_name', '')
        user.last_name = data.get('family_name', '')
        
        # For customer users, set the name field
        if not user.is_staff:
            user.name = f"{data.get('given_name', '')} {data.get('family_name', '')}"
        
        return user
