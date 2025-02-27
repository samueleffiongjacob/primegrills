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
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

User = get_user_model()

# Modified register_user function to include email verification
@api_view(["POST"])
def register_user_with_verification(request):
    """Registers a regular user (customer) with email verification."""
    data = request.data
    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=400)
    
    # Create user but set is_active to False until verified
    user = User.objects.create(
        username=data["username"],
        email=data["email"],
        password=make_password(data["password"]),
        phone=data.get("phone"),
        address=data.get("address"),
        is_active=False  # Set to inactive until email is verified
    )
    
    # Generate verification token
    send_verification_email(user)
    
    return Response({
        "message": "User registered successfully. Please check your email to verify your account."
    }, status=201)

@api_view(["POST"])
def register_staff(request):
    """Registers a staff member with additional fields."""
    data = request.data

    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=400)

    staff = User.objects.create(
        username=data["username"],
        email=data["email"],
        password=make_password(data["password"]),
        phone=data.get("phone"),
        address=data.get("address"),
        first_name=data.get("first_name"),
        last_name=data.get("last_name"),
        age=data.get("age"),
        gender=data.get("gender"),
        role=data.get("role"),
        is_staff=True,  # Mark as staff
    )

    refresh = RefreshToken.for_user(staff)
    return Response({
        "message": "Staff registered successfully",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
    }, status=201)

def send_verification_email(user):
    """Send verification email to user."""
    # Generate token and encoded user ID
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    
    # Build the verification URL
    verification_url = f"{settings.FRONTEND_URL}/verify-email/{uid}/{token}/"
    
    # Create email content
    subject = "Verify Your Email Address"
    html_message = render_to_string('email_verification.html', {
        'user': user,
        'verification_url': verification_url,
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
    except Exception as e:
        # Log the error but don't stop registration
        print(f"Error sending verification email: {str(e)}")

@api_view(["GET"])
def verify_email(request, uidb64, token):
    """Verify email using the token from the URL."""
    try:
        # Decode the user ID
        user_id = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=user_id)
        
        # Verify the token
        if default_token_generator.check_token(user, token):
            # Activate the user
            user.is_active = True
            user.save()
            
            # Generate tokens for auto-login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "message": "Email verified successfully. Your account is now active.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            })
        else:
            return Response({"error": "Invalid or expired verification link"}, status=400)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid verification link"}, status=400)

@api_view(["POST"])
def resend_verification_email(request):
    """Resend verification email if the user hasn't verified yet."""
    data = request.data
    email = data.get("email")
    
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    try:
        user = User.objects.get(email=email, is_active=False)
        send_verification_email(user)
        return Response({"message": "Verification email has been resent"})
    except User.DoesNotExist:
        # Don't reveal whether the user exists or is already active
        return Response({"message": "If the email exists and is not verified, a verification email has been sent"})