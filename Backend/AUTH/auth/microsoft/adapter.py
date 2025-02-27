# microsoft/adapter.py
from auth.adapters import BaseSocialAccountAdapter

class MicrosoftSocialAccountAdapter(BaseSocialAccountAdapter):
    """Microsoft-specific social account adapter."""
    
    def populate_user(self, request, sociallogin, data):
        """
        Populate user with data from Microsoft.
        """
        user = super().populate_user(request, sociallogin, data)
        
        # Set username if not set
        if not user.username:
            user.username = data.get('email', '').split('@')[0]
        
        # Set names from Microsoft data
        user.first_name = data.get('givenName', '')
        user.last_name = data.get('surname', '')
        
        # For customer users, set the name field
        if not user.is_staff:
            user.name = f"{data.get('givenName', '')} {data.get('surname', '')}"
        
        return user
