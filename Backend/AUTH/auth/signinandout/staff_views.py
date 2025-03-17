from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from signup.event_publisher import get_publisher
from django.middleware.csrf import get_token
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from signup.models import StaffProfile
from django.contrib.auth.models import update_last_login
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import LoginHistory
from .serializers import LoginHistorySerializer
from datetime import datetime, timedelta
from django.utils import timezone
from query.permissions import IsStaffUser, IsManager
User = get_user_model()

class UserLoginHistoryView(generics.ListAPIView):
    serializer_class = LoginHistorySerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        # Get records from yesterday and today
        yesterday = timezone.now().date() - timedelta(days=1)
        yesterday_start = datetime.combine(yesterday, datetime.min.time())
        yesterday_start = timezone.make_aware(yesterday_start)
        
        return LoginHistory.objects.filter(
            user_id=user_id,
            timestamp__gte=yesterday_start
        )


# login_staff function - stores both tokens in HTTP-only cookies
@api_view(["POST"])
def login_staff(request):
    print('Logging staff in ...')
    data = request.data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # Check if the user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email"}, status=400)  # Specific error for email

    # Check if the password is correct
    user = authenticate(request, email=email, password=password)
    if not user:
        return Response({"error": "Incorrect password"}, status=400)  # Specific error for password
    
    if not hasattr(user, 'staff_profile'):
        return Response({"error": "Invalid email"}, status=400) 

    # Update last_login using Django's signal handler
    update_last_login(None, user)

    # Update the staff profile status to "Active"
    try:
        staff_profile = user.staff_profile
        staff_profile.status = "Active"
        staff_profile.save()
    except StaffProfile.DoesNotExist:
        return Response({"error": "Staff profile not found"}, status=400)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    # Set token expiration times
    access_token_expiry = timezone.now() + timedelta(hours=6)  # Access token expires in 6 hours
    refresh_token_expiry = timezone.now() + timedelta(hours=6)  # Refresh token expires in 6 hours

    # Update last_login using Django's signal handler
    update_last_login(None, user)
    
    LoginHistory.objects.create(
        user=user,
        action='login'
    )

    # Emit user logged-in event
    publisher = get_publisher()
    publisher.publish_event('staff.loggedin', {'user_id': user.id})

    response = JsonResponse({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.staff_profile.role,
            "status": user.staff_profile.status
        }
    })

    # Set HTTP-only cookies
    response.set_cookie("access_token", access_token, httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60 )
    response.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60)
    response.set_cookie("csrftoken", get_token(request), samesite="Lax", secure=True)

    return response

@api_view(["POST"])
def login_pos(request):
    print('Logging staff in ...')
    data = request.data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)

    # Check if the user exists
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email"}, status=400)  # Specific error for email

    # Check if the password is correct
    user = authenticate(request, email=email, password=password)
    if not user:
        return Response({"error": "Incorrect password"}, status=400)  # Specific error for password
    
    if not hasattr(user, 'staff_profile'):
        return Response({"error": "Invalid email"}, status=400) 

    role = user.staff_profile.role.lower()
    print(role)
    if role not in ["pos", "manager", "accountant", "admin"]:
        return Response({"error": "Invalid email"}, status=400)

    # Update the staff profile status to "Active"
    try:
        staff_profile = user.staff_profile
        staff_profile.status = "Active"
        staff_profile.save()
    except StaffProfile.DoesNotExist:
        return Response({"error": "Staff profile not found"}, status=400)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    
    # Set token expiration times
    access_token_expiry = timezone.now() + timedelta(hours=6)  # Access token expires in 6 hours
    refresh_token_expiry = timezone.now() + timedelta(hours=6)  # Refresh token expires in 6 hours
 
    # Update last_login using Django's signal handler
    update_last_login(None, user)

    LoginHistory.objects.create(
        user=user,
        action='login'
    )

    # Emit user logged-in event
    publisher = get_publisher()
    publisher.publish_event('pos_staff.loggedin', {'user_id': user.id})

    response = JsonResponse({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.staff_profile.role,
            "status": user.staff_profile.status
        }
    })

    # Set HTTP-only cookies with 6-hour expiration
    response.set_cookie("access_token", access_token, httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60)
    response.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60)
    response.set_cookie("csrftoken", get_token(request), samesite="Lax", secure=True)

    return response


@api_view(["POST"])
@permission_classes([IsStaffUser])
def logout_staff(request):
    try:
        refresh_token = request.COOKIES.get("refresh_token")
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()

        LoginHistory.objects.create(
            user=request.user,
            action='logout'
        )
        
        publisher = get_publisher()
        if hasattr(request, 'user') and request.user.id:
            publisher.publish_event('staff.loggedout', {"user_id": request.user.id})
        
        # Update the staff profile status to "Inactive"
        try:
            staff_profile = request.user.staff_profile
            staff_profile.status = "Inactive"
            staff_profile.save()
        except StaffProfile.DoesNotExist:
            pass  # Ignore if staff profile doesn't exist
        
        response = Response({"message": "Logout successful"}, status=200)
        
        # Clear cookies
        response.delete_cookie("access_token")
        response.delete_cookie("refresh_token")
        
        return response
        
    except TokenError:
        return Response({"error": "Invalid token"}, status=400)
    except Exception as e:
        return Response({"error": f"Logout failed: {str(e)}"}, status=500)
    
# login_manager function - stores both tokens in HTTP-only cookies
@api_view(["POST"])
def login_manager(request):
    print('Logging staff in ...')
    data = request.data
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return Response({"error": "Email and password are required"}, status=400)
    
    # Check if the user exists
    if email != "manager@primegrills.com":
        print('hjjj')
        return Response({"error": "Invalid email"}, status=400)

    # Check if the password is correct
    user = authenticate(request, email=email, password=password)
    if not user:
        return Response({"error": "Incorrect password"}, status=400)  # Specific error for password
    
    # Update last_login using Django's signal handler
    update_last_login(None, user)

    # Update the staff profile status to "Active"
    try:
        staff_profile = user.staff_profile
        staff_profile.status = "Active"
        staff_profile.save()
    except StaffProfile.DoesNotExist:
        return Response({"error": "Staff profile not found"}, status=400)

    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    # Set token expiration times
    access_token_expiry = timezone.now() + timedelta(hours=6)  # Access token expires in 6 hours
    refresh_token_expiry = timezone.now() + timedelta(hours=6)  # Refresh token expires in 6 hours


    LoginHistory.objects.create(
        user=user,
        action='login'
    )


    # Emit user logged-in event
    publisher = get_publisher()
    publisher.publish_event('manager.loggedin', {'user_id': user.id})

    response = JsonResponse({
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.staff_profile.role,
            "status": user.staff_profile.status
        }
    })

    # Set HTTP-only cookies with 6-hour expiration
    response.set_cookie("access_token", access_token, httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60)
    response.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax", secure=True, max_age=6 * 60 * 60)
    response.set_cookie("csrftoken", get_token(request), samesite="Lax", secure=True)

    return response
