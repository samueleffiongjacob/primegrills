from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    LoginViewSet, 
    OAuthProviderViewSet, 
    OAuthAccountViewSet,
    register_user,
    CustomLoginView,
    health_check
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'logins', LoginViewSet)
router.register(r'oauth-providers', OAuthProviderViewSet)
router.register(r'oauth-accounts', OAuthAccountViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/register/', register_user, name='register'),
    path('api/login/', CustomLoginView.as_view(), name='login'),
    path('health/', health_check, name='health_check'),
]
