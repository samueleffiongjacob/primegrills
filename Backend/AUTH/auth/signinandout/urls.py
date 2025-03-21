from django.urls import path
from .user_views import LoginView, LogoutView
from .staff_views import ManagerLoginView, StaffLoginView, POSLoginView, logout_staff, UserLoginHistoryView
from .token_views import token_refresh


urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("login_staff/", StaffLoginView.as_view(), name="login_staff"),
    path("login_pos/", POSLoginView.as_view(), name="login-pos"),
    path("login_manager/", ManagerLoginView.as_view(), name="login_manager"),
    path('api/login-history/<int:user_id>/', UserLoginHistoryView.as_view(), name='user-login-history'),
    path("token/refresh/", token_refresh, name="token_refresh"),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout_staff/', logout_staff, name='logout_staff'),
    #path('csrf/', get_csrf, name='get_csrf'),
]   
