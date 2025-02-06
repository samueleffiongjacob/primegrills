from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import make_password
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
    """Register a new user with hashed password."""
    data = request.data
    data['password'] = make_password(data['password'])  # Hash password
    serializer = UserSerializer(data=data)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""LOGIN AND LOGOUT"""

class CustomLoginView(ObtainAuthToken):
    """Login with email & password, return authentication token."""
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        token = Token.objects.get(key=response.data['token'])
        return Response({
            'token': token.key,
            # 'user_id': token.user_id,
            'email': token.user.email
        })


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

