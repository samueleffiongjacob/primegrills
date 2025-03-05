from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .event_publisher import get_publisher  # Import the publisher
from .models import Staff

@api_view(["POST"])
def register_staff(request):
    """Registers a staff member with additional fields."""
    data = request.data

    # Check if email or username already exists in the database
    if Staff.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=400)

    if Staff.objects.filter(username=data["username"]).exists():
        return Response({"error": "Username already exists"}, status=400)

    print(request.data)
    # Create staff user using the custom manager method
    staff = Staff.objects.create(
        username=data["username"],
        email=data["email"],
        password=make_password(data["password"]),
        phone=data.get("phone"),
        address=data.get("address"),
        name=data.get("name"),
        age=data.get("age"),
        gender=data.get("gender"),
        status=data.get("status"),
        role=data.get("role"),
        shift=data.get("shift"),
        shiftHours=data.get("shiftHours"),
        profileImage=data.get("profileImage", ''),  # Handle profileImage if provided
        is_staff=True  # Mark the user as staff
    )

    # Emit staff registered event (optional)
    publisher = get_publisher()
    publisher.publish_event('user.staff_registered', {
        'user_id': staff.id,
        'username': staff.username,
        'email': staff.email,
        'name': staff.name,
        'gender': staff.gender,
        'role': staff.role,
        'shift': staff.shift,
        'shiftHours': staff.shiftHours,
        'created_at': staff.date_joined.isoformat(),
        'user_type': 'staff'
    })

    # Generate access and refresh tokens for the staff user
    #refresh = RefreshToken.for_user(staff)

    return Response({
        "message": "Staff registered successfully"
        """ "access_token": str(refresh.access_token),
        "refresh_token": str(refresh), """
    }, status=201)


@api_view(["POST"])
def register_manager(request):
    """Registers a Manager as a superuser with additional fields."""
    data = request.data

    # Check if email or username already exists in the database
    if Staff.objects.filter(email=data["email"]).exists():
        return Response({"error": "Email already exists"}, status=400)

    if Staff.objects.filter(username=data["username"]).exists():
        return Response({"error": "Username already exists"}, status=400)

    print(request.data)
    # Create staff user using the custom manager method
    staff = Staff.objects.create(
        username=data["username"],
        email=data["email"],
        password=make_password(data["password"]),
        role="Manager",
        profileImage=data.get("profileImage", ''),  # Handle profileImage if provided
        is_staff=True,  # Mark the user as staff
        is_superuser=True # Mark the user as superuser
    )

    # Emit staff registered event (optional)
    publisher = get_publisher()
    publisher.publish_event('user.manager_registered', {
        'user_id': staff.id,
        'username': staff.username,
        'email': staff.email,
        'name': staff.name,
        'gender': staff.gender,
        'role': staff.role,
        'created_at': staff.date_joined.isoformat(),
        'user_type': 'staff'
    })

    # Generate access and refresh tokens for the staff user
    #refresh = RefreshToken.for_user(staff)

    return Response({
        "message": "Manager registered successfully"
        """ "access_token": str(refresh.access_token),
        "refresh_token": str(refresh), """
    }, status=201)
