 # middleware.py
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime, timedelta
import jwt
from django.conf import settings

class JWTRefreshMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        # Only attempt refresh if the user is authenticated
        access_token = request.COOKIES.get('access_token')
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not access_token or not refresh_token:
            return response
            
        try:
            # Check if access token is close to expiration (e.g., less than 2 minutes left)
            payload = jwt.decode(
                access_token, 
                settings.SIMPLE_JWT['SIGNING_KEY'],
                algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
            )
            
            exp_timestamp = payload['exp']
            now = datetime.now().timestamp()
            
            # If token is about to expire, refresh it
            if exp_timestamp - now < 120:  # Less than 2 minutes remaining
                refresh = RefreshToken(refresh_token)
                new_access_token = str(refresh.access_token)
                
                response.set_cookie(
                    "access_token", 
                    new_access_token,
                    httponly=True, 
                    samesite="Lax", 
                    secure=True,
                    max_age=15 * 60  # 15 minutes
                )
                
                # If ROTATE_REFRESH_TOKENS is True, update refresh token too
                if settings.SIMPLE_JWT.get('ROTATE_REFRESH_TOKENS', False):
                    response.set_cookie(
                        "refresh_token", 
                        str(refresh),
                        httponly=True, 
                        samesite="Lax", 
                        secure=True,
                        max_age=6 * 60 * 60  # 6 hours
                    )
                
        except Exception:
            # If there's an error, continue with the response as is
            pass
            
        return response