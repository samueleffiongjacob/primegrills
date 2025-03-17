
from django.urls import path
from signup.user_views import register_user_with_verification,  verify_email, resend_verification_email
from signup.staff_views import RegisterStaffView

urlpatterns = [
    path("register_staff/", RegisterStaffView.as_view(), name="register-staff"),  
    # Email verification
    path('register/', register_user_with_verification, name='register-with-verification'),
    path('email/verify/<str:uidb64>/<str:token>/', verify_email, name='verify-email'),
    path('email/verify/resend/', resend_verification_email, name='resend-verification'),

]
