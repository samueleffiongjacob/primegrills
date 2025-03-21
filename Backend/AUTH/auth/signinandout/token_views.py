from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings

@api_view(['POST'])
def token_refresh(request):
    refresh_token = request.COOKIES.get('refresh_token')
    
    if not refresh_token:
        return Response({"error": "No refresh token provided"}, status=400)
    
    try:
        # Parse the refresh token
        refresh = RefreshToken(refresh_token)
        
        # Get user information from the token
        user_id = refresh.payload.get('user_id')
        
        # Fetch user to get email (you'll need to import your User model)
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(id=user_id)
            # Add email to the access token
            refresh.access_token['email'] = user.email
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=400)
        
        access_token = str(refresh.access_token)
        
        response = Response({"message": "Token refreshed successfully"})
        
        # Set the new access token as a cookie
        response.set_cookie(
            "accessToken", 
            access_token,
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'] if not settings.DEBUG else False,
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
        )
        
        if 'rest_framework_simplejwt.token_blacklist' in settings.INSTALLED_APPS:
            response.set_cookie(
                "refresh_token", 
                str(refresh),
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'] if not settings.DEBUG else False,
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
            )

        return response
        
    except Exception as e:
        return Response({"error": str(e)}, status=400)