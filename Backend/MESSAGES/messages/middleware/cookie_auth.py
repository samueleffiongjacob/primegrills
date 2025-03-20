from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Get the token from the cookie instead of the Authorization header
        header = self.get_header(request)
        print('cookie')
        if header is None:
            print('no header')
            raw_token = request.COOKIES.get('access_token') or None
            print('raw_token', raw_token)
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            print('no token')
            return None
        
        # Use the token from the cookie
        validated_token = self.get_validated_token(raw_token)
        print('validated token', validated_token)
        print('user', self.get_user(validated_token))
        return self.get_user(validated_token), validated_token