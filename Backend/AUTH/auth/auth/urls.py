"""
URL configuration for auth project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.http import HttpResponse # comment letter
from django.contrib import admin
from django.urls import path, include
from signup.views import register_user_with_verification, register_staff, verify_email, resend_verification_email
from signinandout.views import login_user, logout_user
from rest_framework_simplejwt.views import TokenRefreshView


# Add a simple home page view
def home_view(request):
    return HttpResponse("Welcome to PrimeGrills Auth!  Comment it later when u are done")

urlpatterns = [
    path('', home_view, name='home'),  # comment later
    path('admin/', admin.site.urls),
    path("register_staff/", register_staff, name="register_staff"),
    path("login/", login_user, name="login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('logout/', logout_user, name='logout'),
    
    # Email verification
    path('register/', register_user_with_verification, name='register-with-verification'),
    path('email/verify/<str:uidb64>/<str:token>/', verify_email, name='verify-email'),
    path('email/verify/resend/', resend_verification_email, name='resend-verification'),

     # Social auth routes
    path('auth/apple/', include('apple.urls')),
    path('auth/facebook/', include('facebook.urls')),
    path('auth/google/', include('google.urls')),
    path('auth/microsoft/', include('microsoft.urls')),

    # Include dj-rest-auth URLs for token refresh
    path('auth/', include('dj_rest_auth.urls')),
]
