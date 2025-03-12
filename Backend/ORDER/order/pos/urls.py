from django.urls import path
from .views import PosTemporarySelectionViewSet

app_name = 'orders'

urlpatterns = [ 
    path('sockets/', PosTemporarySelectionViewSet.active_session, name='sockets'),
]