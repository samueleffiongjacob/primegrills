# apple/urls.py
from django.urls import path
from .views import AppleLogin

urlpatterns = [
    path('', AppleLogin.as_view(), name='apple_login'),
]
