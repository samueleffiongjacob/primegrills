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
from .event_publisher import get_publisher  # Import the publisher
import datetime
from .serializers import UserSerializer


User = get_user_model()


# Modified register_user function to include email verification
@api_view(["POST"])
def register_user_with_verification(request):
    """Registers a regular user (customer) with email verification."""
    
    data = request.data
    print("Full request data:", request.data)
    print("Request content type:", request.content_type)
    if User.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=400)
    
    if User.objects.filter(username=data["username"]).exists():
        return Response({"error": "Username already exists"}, status=400)
    
    serializer = UserSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            # Generate verification token
            send_verification_email(user)
            
            # Emit user registered event
            publisher = get_publisher()
            publisher.publish_event('user.registered', {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'is_active': user.is_active,
                'created_at': user.date_joined.isoformat(),
                'user_type': 'customer'
            })
            
            return Response({
                "message": "User registered successfully. Please check your email to verify your account."
            }, status=201)
        except Exception as error:
            print(f"Error during user registration: {error}")
            return Response({"error": "Internal server error"}, status=500)
    return Response(serializer.errors, status=400)

def send_verification_email(user):
    """Send verification email to user."""
    # Generate token and encoded user ID
    token = default_token_generator.make_token(user)
    print('user.pk', user.pk)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    print('uid ', uid)
    
    # Build the verification URL
    print(settings.FRONTEND_URL)
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
        
        # Emit verification email sent event
        publisher = get_publisher()
        publisher.publish_event('user.verification_email_sent', {
            'user_id': user.id,
            'email': user.email,
            'timestamp': datetime.datetime.now().isoformat()
        })
    except Exception as e:
        # Log the error but don't stop registration
        print(f"Error sending verification email: {str(e)}")

@api_view(["POST"])
def verify_email(request, uidb64, token):
    """Verify email using the token from the URL."""
    print('reached here')
    try:
        print("Received request for email verification")
        print(uidb64)
        # Decode the user ID
        user_id = force_str(urlsafe_base64_decode(uidb64))
        print(f"Decoded user_id: {user_id}")
        
        user = User.objects.get(pk=user_id)
        print(f"Retrieved user: {user}")
        
        # Verify the token
        if default_token_generator.check_token(user, token):
            print("Token is valid")
            
            # Activate the user
            user.is_active = True
            user.save()
            print("User account activated")
            
            # Emit email verified event
            publisher = get_publisher()
            publisher.publish_event('user.email_verified', {
                'user_id': user.id,
                'email': user.email,
                'verified_at': datetime.datetime.now().isoformat()
            })
            print("Published email verified event")
            
            # Generate tokens for auto-login
            refresh = RefreshToken.for_user(user)
            print("Generated access and refresh tokens")
            
            return Response({
                "message": "Email verified successfully. Your account is now active.",
                "access_token": str(refresh.access_token),
                "refresh_token": str(refresh),
            })
        else:
            print("Invalid or expired verification link")
            return Response({"error": "Invalid or expired verification link"}, status=400)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist) as e:
        print(f"Error occurred: {e}")
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