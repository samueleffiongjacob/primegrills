# facebook/urls.py
from django.urls import path
from django.contrib import admin
from . import user_views, staff_views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # User management routes
    path('users/profile/', user_views.user_profile, name='user-profile'),
    path('users/all/', user_views.get_all_users, name='get-all-users'),
    path('users/<int:user_id>/', user_views.get_user_by_id, name='get-user-by-id'),
    path('users/update/', user_views.update_user_profile, name='update-user-profile'),
    path('users/delete/<int:user_id>/', user_views.delete_user, name='delete-user'),

    # Staff management roles
    path('staff/profile/', staff_views.staff_profile, name='staff-profile'),
    path('staffs/all/', staff_views.get_all_staffs, name='get-all-staffs'),
    path('staffs/<int:user_id>/', staff_views.get_staff_by_id, name='get-staff-by-id'),
    path('staffs/update/', staff_views.update_staff_profile, name='update-staff-profile'),
    path('staffs/delete/<int:staff_id>/', staff_views.delete_staff, name='delete-staff'),
]
# for profile image
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)