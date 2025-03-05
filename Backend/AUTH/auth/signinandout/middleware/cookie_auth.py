from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get the token from the cookie instead of the Authorization header
        token = request.COOKIES.get('access_token')
        
        if token is None:
            return None
        
        # Use the token from the cookie
        validated_token = self.get_validated_token(token)
        return self.get_user(validated_token), validated_token