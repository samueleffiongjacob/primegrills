# auth/adapters.py

from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.utils import user_email

class BaseSocialAccountAdapter(DefaultSocialAccountAdapter):
    """Base adapter for social accounts with common functionality."""
    
    def populate_user(self, request, sociallogin, data):
        """
        Base populate_user method that will be extended by provider-specific adapters.
        """
        user = super().populate_user(request, sociallogin, data)
        
        # Set email
        if 'email' in data:
            user_email(user, data['email'])
        
        return user
    
    def save_user(self, request, sociallogin, form=None):
        """
        Save the user and connect their social account.
        """
        user = super().save_user(request, sociallogin, form)
        
        # Automatically set user as active
        user.is_active = True
        user.save()
        
        return user