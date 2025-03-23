from backend.backends import EmailBackend
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view
from signup.event_publisher import get_publisher
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from django.conf import settings
User = get_user_model()

authenticate = EmailBackend().authenticate


# Utility function to generate tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    access["email"] = user.email  # Include email in token
    return {"refresh": str(refresh), "access": str(access)}

class BaseAuthView(APIView):
    """ Base class for authentication-related views """
    def get_publisher(self):
        return get_publisher()

class GetCSRFView(BaseAuthView):
    def get(self, request):
        token = get_token(request)
        return JsonResponse({"csrfToken": token})

class LoginView(BaseAuthView):
    def post(self, request):
        data = request.data
        email = data.get("email")
        password = data.get("password")
        
        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)
        
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response({"error": "Email not verified"}, status=400)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=400)

        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({"error": "Incorrect password"}, status=400)

        tokens = get_tokens_for_user(user)
        self.get_publisher().publish_event('user.loggedin', {'user_id': user.id})

        response = JsonResponse({"message": "Login successful"})
        self.set_cookies(response, tokens)
        return response
    
    
    def set_cookies(self, response, tokens):
        response.set_cookie(
            "accessToken", 
            tokens["access"],
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'] if not settings.DEBUG else False,
            max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()
        )
        response.set_cookie(
            "refresh_token", 
            tokens["refresh"], 
            httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
            samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE'],
            secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'] if not settings.DEBUG else False,
            max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
        )
        #response.set_cookie("csrftoken", get_token(self.request), samesite="Lax", secure=True)
        
class LogoutView(BaseAuthView):
    def post(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh_token")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()

            if hasattr(request, 'user') and request.user.id:
                self.get_publisher().publish_event('user.loggedout', {"user_id": request.user.id})

            response = Response({"message": "Logout successful"}, status=200)
            response.delete_cookie("accessToken")
            response.delete_cookie("refresh_token")
            return response
        except TokenError:
            return Response({"error": "Invalid token"}, status=400)
        except Exception as e:
            return Response({"error": f"Logout failed: {str(e)}"}, status=500)
