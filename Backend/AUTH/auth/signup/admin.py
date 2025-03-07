# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import ClientProfile, StaffProfile, CartItem

User = get_user_model()

class ClientProfileInline(admin.StackedInline):
    model = ClientProfile
    can_delete = False
    verbose_name_plural = 'Client Profile'
    fk_name = 'user'

class StaffProfileInline(admin.StackedInline):
    model = StaffProfile
    can_delete = False
    verbose_name_plural = 'Staff Profile'
    fk_name = 'user'

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'name', 'user_type', 'is_active', 'is_staff')
    list_filter = ('user_type', 'is_active', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('name', 'phone', 'address', 'profileImage')}),
        ('Permissions', {'fields': ('user_type', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'user_type', 'is_active', 'is_staff'),
        }),
    )
    search_fields = ('username', 'email', 'name')
    ordering = ('email',)
    
    def get_inlines(self, request, obj=None):
        if obj:
            if obj.user_type == 'client':
                return [ClientProfileInline]
            elif obj.user_type == 'staff':
                return [StaffProfileInline]
        return []

class CartItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'quantity', 'price')
    list_filter = ('user',)
    search_fields = ('name', 'user__email')

# Register the models
admin.site.register(User, CustomUserAdmin)
admin.site.register(CartItem, CartItemAdmin)