from django.urls import path
from .views import GoogleLogin

urlpatterns = [
    path('', GoogleLogin.as_view(), name='google_login'),
]
