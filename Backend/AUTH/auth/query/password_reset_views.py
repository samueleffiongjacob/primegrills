from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from django.contrib.auth.hashers import make_password

User = get_user_model()

@api_view(["POST"])
def request_password_reset(request):
    """Request a password reset by providing email address."""
    data = request.data
    email = data.get("email")
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        # Don't reveal that the user doesn't exist for security reasons
        return Response({"message": "If the email exists, a password reset link has been sent"})
    
    # Generate token and encoded user ID
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build the reset URL (frontend URL where the user will be redirected)
    reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}/"
    
    # Create email content
    subject = "Password Reset Request"
    html_message = render_to_string('password_reset_email.html', {
        'user': user,
        'reset_url': reset_url,
    })
    plain_message = strip_tags(html_message)
    
    # Send email
    try:
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            html_message=html_message,
            fail_silently=False,
        )
        return Response({"message": "Password reset email has been sent"})
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(["POST"])
def verify_reset_token(request):
    """Verify that a password reset token is valid."""
    data = request.data
    uid = data.get("uid")
    token = data.get("token")
    
    if not uid or not token:
        return Response({"error": "Both UID and token are required"}, status=400)
    
    try:
        # Decode the user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify the token
        if default_token_generator.check_token(user, token):
            return Response({"message": "Token is valid", "valid": True})
        else:
            return Response({"message": "Invalid or expired token", "valid": False}, status=400)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"message": "Invalid reset link", "valid": False}, status=400)

@api_view(["POST"])
def reset_password(request):
    """Reset the password using the token and UID."""
    data = request.data
    uid = data.get("uid")
    token = data.get("token")
    new_password = data.get("new_password")
    
    if not uid or not token or not new_password:
        return Response({"error": "UID, token, and new password are required"}, status=400)
    
    try:
        # Decode the user ID
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
        
        # Verify the token
        if default_token_generator.check_token(user, token):
            # Set the new password
            user.password = make_password(new_password)
            user.save()
            return Response({"message": "Password has been reset successfully"})
        else:
            return Response({"error": "Invalid or expired token"}, status=400)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid reset link"}, status=400)