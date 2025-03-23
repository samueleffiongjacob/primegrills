from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'client-profiles', views.ClientProfileViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'staffs', views.StaffProfileViewSet)
router.register(r'threads', views.ThreadViewSet)
router.register(r'messages', views.MessageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # Thread and message endpointss
    path('my-threads/', views.ThreadListCreateView.as_view(), name='my-threads'),
    path('customer-threads/', views.ClientThreadsView.as_view(), name='customer-threads'),
    path('thread-messages/', views.MessageListCreateView.as_view(), name='thread-messages'),
    path('feedback/', views.FeedbackView.as_view(), name='feedback'),
    
    # New messaging endpoints
    path('send-message/<int:user_id>/', views.SendMessageToUserView.as_view(), name='send-message-to-user'),
    path('send-group-message/', views.SendMessageToMultipleUsersView.as_view(), name='send-group-message'),
    path('mark-read/<int:thread_id>/', views.mark_thread_as_read, name='mark_thread_as_read'),
]