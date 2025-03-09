from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view
from signup.event_publisher import get_publisher
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model

User = get_user_model()

def get_csrf(request):
    token = get_token(request)
    return JsonResponse({"csrfToken": token})


# login_staff function - stores both tokens in HTTP-only cookies
@api_view(["POST"])
def login_staff(request):
    print('logging staff in ...')
    data = request.data
    user = authenticate(request, email=data.get("email"), password=data.get("password"))

    if user:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        # Emit user logged in event
        publisher = get_publisher()
        publisher.publish_event('staff.loggedin', {
            'user_id': user.id,
        })
        
        response = JsonResponse({
            "message": "Login successful",
        })

        # Set access token in HTTP-only cookie
        response.set_cookie(
            "access_token", 
            access_token,
            httponly=True, 
            samesite="Lax", 
            secure=True,
            max_age=15 * 60  # 15 minutes
        )
        
        # Set refresh token in HTTP-only cookie
        response.set_cookie(
            "refresh_token", 
            str(refresh),
            httponly=True, 
            samesite="Lax", 
            secure=True,
            max_age=6 * 60 * 60  # 6 hours
        )
        
        # Set CSRF token
        response.set_cookie(
            "csrftoken", 
            get_token(request), 
            samesite="Lax", 
            secure=True
        )
        
        return response
    
    return Response({"error": "Invalid credentials"}, status=400)


@api_view(["POST"])
def logout_staff(request):
    try:
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        publisher = get_publisher()
        if hasattr(request, 'user') and request.user.id:
            publisher.publish_event('staff.loggedout', {"user_id": request.user.id})
        
        response = Response({"message": "Logout successful"}, status=200)
        
        # Clear cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        
        return response
        
    except TokenError:
        return Response({"error": "Invalid token"}, status=400)
    except Exception as e:
        return Response({"error": f"Logout failed: {str(e)}"}, status=500)