
from django.contrib import admin
from .models import AuthEvent

class AuthEventAdmin(admin.ModelAdmin):
    list_display = ('event_type', 'timestamp')
    search_fields = ('event_type',)
    list_filter = ('event_type', 'timestamp')

admin.site.register(AuthEvent, AuthEventAdmin)