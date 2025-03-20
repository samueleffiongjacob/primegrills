from rest_framework import generics, permissions
from .models import Message, Thread
from .serializers import MessageSerializer, ThreadSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated


class ThreadListCreateView(generics.ListCreateAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Thread.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        thread = serializer.save()
        thread.participants.add(self.request.user)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(thread__participants=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import User, ClientProfile, StaffProfile, Thread, Message
from .serializers import UserSerializer, ClientProfileSerializer, StaffProfileSerializer, ThreadSerializer, MessageSerializer

@api_view(["GET"])
def get_all_staffs(request):
    """
    Get all users - accessible only by all staff
    """
    print(request.user.is_authenticated)
    staffs = User.objects.filter(user_type='staff').select_related('staff_profile')  # Filter only staff users
    serializer = StaffProfileSerializer(staffs, many=True)
    return Response(serializer.data)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ClientProfileViewSet(viewsets.ModelViewSet):
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSerializer

class StaffProfileViewSet(viewsets.ModelViewSet):
    queryset =  StaffProfile.objects.all()
    serializer_class = StaffProfileSerializer

class ThreadViewSet(viewsets.ModelViewSet):
    queryset = Thread.objects.all()
    serializer_class = ThreadSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer

from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from .models import Message, Thread
from .serializers import MessageSerializer, ThreadSerializer

User = get_user_model()

class SendMessageToUserView(APIView):
    """
    Send a message to a single user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            recipient = User.objects.get(id=user_id)
            content = request.data.get('content')
            
            if not content:
                return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Find or create thread between current user and recipient
            thread = Thread.objects.filter(participants=request.user).filter(participants=recipient)
            
            # If there are multiple threads, get the first one
            # In a real app, you might want to handle this differently
            if thread.exists():
                thread = thread.first()
            else:
                thread = Thread.objects.create()
                thread.participants.add(request.user, recipient)
            
            # Create message
            message = Message.objects.create(
                sender=request.user,
                thread=thread,
                content=content
            )
            
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SendMessageToMultipleUsersView(APIView):
    """
    Send a message to multiple users
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            user_ids = request.data.get('user_ids', [])
            content = request.data.get('content')
            
            if not content:
                return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            if not user_ids or not isinstance(user_ids, list):
                return Response({"error": "Valid user IDs list is required"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Get all recipients
            recipients = User.objects.filter(id__in=user_ids)
            
            if not recipients.exists():
                return Response({"error": "No valid recipients found"}, status=status.HTTP_404_NOT_FOUND)
            
            # Create a new thread with all participants
            thread = Thread.objects.create()
            thread.participants.add(request.user, *recipients)
            
            # Create message
            message = Message.objects.create(
                sender=request.user,
                thread=thread,
                content=content
            )
            
            return Response(MessageSerializer(message).data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)