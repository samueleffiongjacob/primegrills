from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view
from signup.event_publisher import get_publisher

@api_view(["POST"])
def login_user(request):
    data = request.data
    user = authenticate(request, email=data.get("email"), password=data.get("password"))

    if user:
        refresh = RefreshToken.for_user(user)
        # Emit user logged in event
        publisher = get_publisher()
        publisher.publish_event('user.loggedin', {
            'user_id': user.id,
            'username': user.username,
            'email': user.email,
        })
        return Response({
            "message": "Login successful",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
        })
    
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(["POST"])
def logout_user(request):
    try:
        refresh_token = request.data.get("refresh_token")
        if not refresh_token:
            return Response({"error": "Refresh token is required"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()  # Add token to the blacklist 

        # Emit user logged out event (fixed event type)
        publisher = get_publisher()
        publisher.publish_event('user.loggedout', {"message": "User logged out successfully"})

        return Response({"message": "Logout successful"}, status=200)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=400)
