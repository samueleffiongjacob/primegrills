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
from django.conf import settings
from django.urls import path, include
from django.conf.urls.static import static

# Add a simple home page view
def home_view(request):
    return HttpResponse("Welcome to PrimeGrills Auth!  Comment it later when u are done")

urlpatterns = [
    path('', home_view, name='home'),  # comment later
    path('admin/', admin.site.urls),

     # Social auth routes
    path('auth/apple/', include('apple.urls')),
    path('auth/facebook/', include('facebook.urls')),
    path('auth/google/', include('google.urls')),
    path('auth/microsoft/', include('microsoft.urls')),

    # Include dj-rest-auth URLs for token refresh
    path('auth/', include('dj_rest_auth.urls')),

    # User and Staff regular signups
    path('', include('signup.urls')),

    # User and Staff logins
    path('', include('signinandout.urls')),

    # User and Staff queries
    path('api/', include('query.urls')),
]
# for profile images in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)