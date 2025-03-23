from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .event_publisher import get_publisher


User = get_user_model()

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from .se import RegisterStaffSerializer

class RegisterStaffView(generics.CreateAPIView):
    """API endpoint to register a new staff user (requires admin permissions)."""
    queryset = User.objects.all()
    serializer_class = RegisterStaffSerializer
    permission_classes = [IsAdminUser]  # Only admin users can create staff accounts

    def create(self, request, *args, **kwargs):
        data = request.data
        if User.objects.filter(email=data["email"]).exists():
            return Response({"error": "Email already exists"}, status=400)
    
        if User.objects.filter(username=data["username"]).exists():
            return Response({"error": "Username already exists"}, status=400)
    
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            try:
                user = serializer.save()
                
                # Emit staff registered event
                publisher = get_publisher()
                publisher.publish_event('StaffSignedUp', {
                    'user_id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': user.staff_profile.role,
                    'is_active': True,
                    'created_at': user.date_joined.isoformat(),
                    'user_type': 'staff'
                })
            
                return Response({"message": "Staff registered successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
            except Exception as error:
                print(f"Error during staff registration: {error}")
                return Response({"error": "Internal server error"}, status=500)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  