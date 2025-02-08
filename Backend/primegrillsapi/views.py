from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import check_password
from django.contrib.auth import login, logout
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework import viewsets
from .models import User, Login, OAuthProvider, OAuthAccount
from .serializers import (
    UserSerializer, 
    LoginSerializer, 
    OAuthProviderSerializer, 
    OAuthAccountSerializer, 
)

"""REGISTER USERS """
@api_view(['POST'])
def register_user(request):
    """Register a new user with hashed password, auto-fetch IP & User-Agent, and check if email exists.."""
    data = request.data

    # Check if email already exists
    if User.objects.filter(email=data.get('email')).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if phone number is numeric
    import re
    if not re.match(r'^\+?\d{10,15}$', data.get('phone', '')):
        return Response({'error': 'Phone number must contain only numbers'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Automatically fetch IP & User-Agent
    ip_address = request.META.get('REMOTE_ADDR')
    user_agent = request.META.get('HTTP_USER_AGENT')

    # Add IP & User-Agent to data
    data['ip'] = ip_address
    data['user_agent'] = user_agent

    # Hash password
    data['password'] = make_password(data['password'])  # Hash password
    
    # Include SSN only if provided
    ssn = data.get('ssn')
    if ssn:
        data['ssn'] = ssn

    serializer = UserSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': f'{User.name}: you have  registered successfully to Primegrills'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""LOGIN AND LOGOUT"""

class CustomLoginView(ObtainAuthToken):
    """Login with email & password, return authentication token."""
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            'user_id': token.user_id,
            'email': token.user.email
        })


"""LOGIN USERS"""
@api_view(['POST'])
def login_user(request):
    """Login with email or username and return authentication token"""
    data = request.data
    username_or_email = data.get('username')  # username or email
    password = data.get('password')

    # user = authenticate(request, username=username_or_email, password=password)
    if not username_or_email or not password:
        return Response({'error': 'Either Username or Email  are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Try to find user by email first, then by username
    user = User.objects.filter(email=username_or_email).first() or User.objects.filter(username=username_or_email).first()


    if user and user.check_password(password):
        # Generate token
        token, created = Token.objects.get_or_create(user=user)
        
        # Store login details
        Login.objects.create(
            user=user, 
            ip_address=request.META.get('REMOTE_ADDR'), 
            user_agent=request.META.get('HTTP_USER_AGENT')
        )

        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'username': user.username,
            'phone': user.phone
        }, status=status.HTTP_200_OK)

    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


"""LOGOUT USERS"""
@api_view(['POST'])
def logout_user(request):
    """Logout by deleting auth token"""
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)



@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint to verify if the server is running.
    """
    return Response({"status": "Server is running"}, status=200)

# User ViewSet
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# Login ViewSet
class LoginViewSet(viewsets.ModelViewSet):
    queryset = Login.objects.all()
    serializer_class = LoginSerializer

# OAuth Provider ViewSet
class OAuthProviderViewSet(viewsets.ModelViewSet):
    queryset = OAuthProvider.objects.all()
    serializer_class = OAuthProviderSerializer

# OAuth Account ViewSet
class OAuthAccountViewSet(viewsets.ModelViewSet):
    queryset = OAuthAccount.objects.all()
    serializer_class = OAuthAccountSerializer

