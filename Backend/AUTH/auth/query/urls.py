# facebook/urls.py
from django.urls import path
from django.contrib import admin
from . import user_views, staff_views,password_reset_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # User management routes
    path('user/profile/', user_views.user_profile, name='user-profile'),
    path('users/all/', user_views.get_all_users, name='get-all-users'),
    path("user/profile/upload-image/", user_views.upload_profile_image, name="upload_profile_image"),
    path('users/<int:user_id>/', user_views.get_user_by_id, name='get-user-by-id'),
    path('users/update/', user_views.update_user_profile, name='update-user-profile'),
    path('user/delete/<int:user_id>/', user_views.delete_user, name='delete-user'),
    path('request_password_reset/', password_reset_views.request_password_reset, name='request-password-reset'),
    path('reset_password/', password_reset_views.reset_password, name='reset-password'),
    path('verify_reset_token/', password_reset_views.verify_reset_token, name='verify-reset-token'),
    path("cart/update/", user_views.update_cart, name="update-cart"), 
    path("user/cart/", user_views.get_user_cart, name="get-user-cart"), 


    # Staff management roles
    path('staff/profile/', staff_views.staff_profile, name='staff-profile'),
    path('staffs/all/', staff_views.get_all_staffs, name='get-all-staffs'),
    path('staffs/<int:user_id>/', staff_views.get_staff_by_id, name='get-staff-by-id'),
    path('staffs/profile/update/', staff_views.update_staff_profile, name='update-staff-profile'),
    path('staffs/profile/update-password/', staff_views.update_staff_password, name='update-staff-password'),
    path('manager/staffs/update/<int:user_id>/', staff_views.manager_update_staff, name='manager-update-staff'),
    path('staffs/delete/<int:staff_id>/', staff_views.delete_staff, name='delete-staff'),
]
# for profile image
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)