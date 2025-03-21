from django.utils import timezone
from datetime import datetime, timedelta
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import update_last_login
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from .models import LoginHistory
from .serializers import LoginHistorySerializer
from signup.event_publisher import get_publisher
from query.permissions import IsStaffUser
from signup.models import StaffProfile

User = get_user_model()

# Utility function to generate tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    access = refresh.access_token
    access["email"] = user.email  # Include email in token
    return {"refresh": str(refresh), "access": str(access)}

class BaseLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        user = authenticate(request, email=email, password=password)
        if not user:
            return Response({"error": "Invalid email or password"}, status=400)

        if not hasattr(user, 'staff_profile'):
            return Response({"error": "Invalid email"}, status=400)

        self.validate_role(user)
        self.update_status(user)
        self.record_login(user)
        self.emit_event(user)

        tokens = get_tokens_for_user(user)
        response = JsonResponse({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.staff_profile.role,
                "status": user.staff_profile.status
            }
        })
        self.set_cookies(response, tokens)
        return response

    def validate_role(self, user):
        pass  # Override in subclasses if role validation is needed

    def update_status(self, user):
        user.staff_profile.status = "Active"
        user.staff_profile.save()
        update_last_login(None, user)

    def record_login(self, user):
        LoginHistory.objects.create(user=user, action='login')

    def emit_event(self, user):
        publisher = get_publisher()
        publisher.publish_event(f'{self.event_name}.loggedin', {'user_id': user.id})

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


class StaffLoginView(BaseLoginView):
    event_name = "staff"


class POSLoginView(BaseLoginView):
    event_name = "pos_staff"

    def validate_role(self, user):
        if user.staff_profile.role.lower() not in ["pos", "manager", "accountant", "admin"]:
            raise Response({"error": "Unauthorized role"}, status=400)

class ManagerLoginView(BaseLoginView):
    event_name = "manager"

    def post(self, request):
        email = request.data.get("email")
        if email != "manager@primegrills.com":
            return Response({"error": "Invalid email"}, status=400)
        return super().post(request)


@api_view(["POST"])
@permission_classes([IsStaffUser])
def logout_staff(request):
    try:
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        LoginHistory.objects.create(user=request.user, action='logout')
        get_publisher().publish_event('staff.loggedout', {"user_id": request.user.id})

        try:
            request.user.staff_profile.status = "Inactive"
            request.user.staff_profile.save()
        except StaffProfile.DoesNotExist:
            pass

        response = Response({"message": "Logout successful"}, status=200)
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        return response
    
    except TokenError:
        return Response({"error": "Invalid token"}, status=400)
    except Exception as e:
        return Response({"error": f"Logout failed: {str(e)}"}, status=500)


class UserLoginHistoryView(APIView):
    serializer_class = LoginHistorySerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        yesterday = timezone.now().date() - timedelta(days=1)
        start_time = timezone.make_aware(datetime.combine(yesterday, datetime.min.time()))
        queryset = LoginHistory.objects.filter(user_id=user_id, timestamp__gte=start_time)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
