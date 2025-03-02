from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser

class CustomUserAdmin(UserAdmin):
    list_display = ("id", "username", "email", "is_staff", "is_superuser", "date_joined")
    list_filter = ("is_staff", "is_superuser")
    search_fields = ("username", "email")
    ordering = ("date_joined",)
    
    fieldsets = (
        ("User Info", {"fields": ("username", "email", "password")}),
        ("Personal Details", {"fields": ("name", "first_name", "last_name", "age", "gender", "phone", "address", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important Dates", {"fields": ("last_login", "date_joined")}),
    )

admin.site.register(CustomUser, CustomUserAdmin)
