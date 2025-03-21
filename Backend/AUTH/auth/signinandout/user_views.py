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

User = get_user_model()

authenticate = EmailBackend().authenticate

def set_auth_cookies(response, access_token, refresh_token, request):
    """ Helper function to set authentication cookies securely """
    response.set_cookie("access_token", access_token, httponly=True, samesite="Lax", secure=True, max_age=5 * 24 * 60 * 60)
    response.set_cookie("refresh_token", refresh_token, httponly=True, samesite="Lax", secure=True, max_age=5 * 24 * 60 * 60)
    response.set_cookie("csrftoken", get_token(request), samesite="Lax", secure=True)
    return response

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    access["email"] = user.email  # Include email in access token
    return str(access), str(refresh)

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

        access_token, refresh_token = get_tokens_for_user(user)
        self.get_publisher().publish_event('user.loggedin', {'user_id': user.id})

        response = JsonResponse({"message": "Login successful"})
        return set_auth_cookies(response, access_token, refresh_token, request)

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
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response
        except TokenError:
            return Response({"error": "Invalid token"}, status=400)
        except Exception as e:
            return Response({"error": f"Logout failed: {str(e)}"}, status=500)
