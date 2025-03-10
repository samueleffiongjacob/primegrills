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
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)
        
        response = Response({"message": "Token refreshed successfully"})
        
        # Set the new access token as a cookie
        response.set_cookie(
            "access_token", 
            access_token,
            httponly=True, 
            samesite="Lax", 
            secure=True,
            max_age=15 * 60  # 15 minutes
        )
        
        # Optionally, if you have ROTATE_REFRESH_TOKENS set to True, set the new refresh token
        if 'rest_framework_simplejwt.token_blacklist' in settings.INSTALLED_APPS:
            response.set_cookie(
                "refresh_token", 
                str(refresh),
                httponly=True, 
                samesite="Lax", 
                secure=True,
                max_age=6 * 60 * 60  # 6 hours
            )
        
        return response
        
    except Exception as e:
        return Response({"error": str(e)}, status=400)