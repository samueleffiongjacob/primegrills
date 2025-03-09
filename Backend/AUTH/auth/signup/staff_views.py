from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .event_publisher import get_publisher
from .serializers import StaffUserSerializer


User = get_user_model()

@api_view(["POST"])
def register_staff(request):
    """Registers a staff user (requires admin permissions)."""

    
    data = request.data
    print(data)
    if User.objects.filter(email=data["email"]).exists():
        print('user exists email')
        return Response({"error": "Email already exists"}, status=400)
    
    if User.objects.filter(username=data["username"]).exists():
        print('user exists username')
        return Response({"error": "Username already exists"}, status=400)
    print('here')
    # Use StaffUserSerializer for staff registration
    serializer = StaffUserSerializer(data=request.data)
    
    if serializer.is_valid():
        try:
            user = serializer.save()
            
            # Emit staff registered event
            publisher = get_publisher()
            publisher.publish_event('user.staff_registered', {
                'user_id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.staff_profile.role,
                'is_active': True,
                'created_at': user.date_joined.isoformat(),
                'user_type': 'staff'
            })
            
            return Response({
                "message": "Staff user registered successfully.",
                "user_id": user.id,
                "username": user.username,
                "email": user.email
            }, status=201)
        except Exception as error:
            print(f"Error during staff registration: {error}")
            return Response({"error": "Internal server error"}, status=500)
    return Response(serializer.errors, status=400)





   