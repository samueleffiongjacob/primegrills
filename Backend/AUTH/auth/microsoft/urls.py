# microsoft/urls.py
from django.urls import path
from .views import MicrosoftLogin

urlpatterns = [
    path('', MicrosoftLogin.as_view(), name='microsoft_login'),
]
