from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response({"error": "No refresh token found in cookies"}, 
                           status=status.HTTP_401_UNAUTHORIZED)
        
        # Add the refresh token to the request data
        request.data['refresh'] = refresh_token
            
        try:
            # Call the parent post method
            response = super().post(request, *args, **kwargs)
            
            # Extract the new access token
            if response.status_code == status.HTTP_200_OK and 'access' in response.data:
                access_token = response.data['access']
                
                # Create a new response without the tokens in body
                new_response = Response({"message": "Token refreshed"}, status=status.HTTP_200_OK)
                
                # Set the new access token in cookie
                new_response.set_cookie(
                    "access_token", 
                    access_token,
                    httponly=True, 
                    samesite="Lax", 
                    secure=True,
                    max_age=15 * 60  # 15 minutes
                )
                
                return new_response
            
            return response
        except (InvalidToken, TokenError) as e:
            return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)