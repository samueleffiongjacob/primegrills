from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.exceptions import AuthenticationFailed

User = get_user_model()
p

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        #print('cookie')
        if header is None:
            #print('no header')
            raw_token = request.COOKIES.get('accessToken') or None
            #print('raw_token', raw_token)
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            #print('no token')
            return None
        
        # Use the token from the cookie
        try:
            validated_token = self.get_validated_token(raw_token)
            #print("Validated token:", validated_token)
        except TokenError as e:
            #rint("Token validation error:", str(e))
            raise AuthenticationFailed("Invalid token")

        email = validated_token.get("email")
        #print(email)
        if not email:
            #print("Email missing in token")
            raise AuthenticationFailed("Email missing in token")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            #print("User not found")
            raise AuthenticationFailed("User not found")

        return user, validated_token