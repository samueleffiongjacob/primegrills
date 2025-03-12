from django.urls import path
from .user_views import login_user, logout_user, get_csrf
from .staff_views import login_staff, login_pos,  login_manager, logout_staff, UserLoginHistoryView
from .token_views import token_refresh


urlpatterns = [
    path("login/", login_user, name="login"),
    path("login_staff/", login_staff, name="login_staff"),
    path("login_pos/", login_pos, name="login-pos"),
    path("login_manager/", login_manager, name="login_manager"),
    path('api/login-history/<int:user_id>/', UserLoginHistoryView.as_view(), name='user-login-history'),
    path("token/refresh/", token_refresh, name="token_refresh"),
    path('logout/', logout_user, name='logout'),
    path('logout_staff/', logout_staff, name='logout_staff'),
    path('csrf/', get_csrf, name='get_csrf'),
]   
