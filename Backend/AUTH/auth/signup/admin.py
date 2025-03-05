from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Staff  # Import models

# Custom Admin for User model
class CustomUserAdmin(UserAdmin):
    # Define the fields to display in the admin list view
    list_display = ('username', 'email', 'name', 'phone', 'is_active', 'date_joined')
    list_filter = ('is_active','date_joined')
    search_fields = ('username', 'email', 'name', 'phone')

    # Define the fieldsets for the add/edit form
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone', 'address', 'profileImage')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Define the fieldsets for the add form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )

    ordering = ('username',)

# Register the User model with the CustomUserAdmin
admin.site.register(User, CustomUserAdmin)

# Custom Admin for Staff model
class StaffAdmin(UserAdmin):
    # Define the fields to display in the admin list view
    list_display = ('username', 'email', 'name', 'role', 'shift', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'role', 'shift')
    search_fields = ('username', 'email', 'name', 'role', 'shift')

    # Define the fieldsets for the add/edit form
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('name', 'phone', 'address', 'profileImage', 'age', 'gender')}),
        ('Staff Info', {'fields': ('role', 'shift', 'shiftHours')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important Dates', {'fields': ('last_login', 'date_joined')}),
    )

    # Define the fieldsets for the add form
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'is_active', 'is_staff', 'is_superuser', 'role', 'shift'),
        }),
    )

    ordering = ('username',)

# Register the Staff model with the StaffAdmin
admin.site.register(Staff, StaffAdmin)