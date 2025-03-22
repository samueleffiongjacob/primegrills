from rest_framework import generics, permissions
from .models import User, ClientProfile, StaffProfile, Thread, Message
from .serializers import UserSerializer, ClientProfileSerializer, StaffProfileSerializer, ThreadSerializer, MessageSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


class ThreadListCreateView(generics.ListCreateAPIView):
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Thread.objects.filter(participants=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        thread = serializer.save()
        thread.participants.add(self.request.user)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Message.objects.filter(thread__participants=self.request.user)

    def perform_create(self, serializer):
        thread_id = self.request.data.get('thread')
        thread = Thread.objects.get(id=thread_id)
        
        # Get the first message in the thread to use its subject
        first_message = Message.objects.filter(thread=thread).order_by('timestamp').first()
        
        # If this is a reply, use the original subject
        subject = None
        if first_message:
            subject = first_message.subject
            
        serializer.save(sender=self.request.user, subject=subject)


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
    queryset = Thread.objects.all().order_by('-created_at')
    serializer_class = ThreadSerializer

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer


class SendMessageToUserView(APIView):
    """
    Send a message to a single user
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        try:
            recipient = User.objects.get(id=user_id)
            content = request.data.get('content')
            subject = request.data.get('subject')
            
            if not content:
                return Response({"error": "Message content is required"}, status=status.HTTP_400_BAD_REQUEST)
        
            thread = Thread.objects.create()
            thread.participants.add(request.user, recipient)
            
            # Create message
            message = Message.objects.create(
                sender=request.user,
                thread=thread,
                subject=subject,
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mark_thread_as_read(request, thread_id):
    """
    Mark all messages in a thread as read for the current user
    """
    # Get the thread or return 404 if not found
    thread = get_object_or_404(Thread, id=thread_id)
    
    # Check if user has permission to access this thread
    if request.user not in thread.participants.all():
        return Response(
            {"detail": "You do not have permission to access this thread."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get all unread messages in the thread not sent by the current user
    unread_messages = Message.objects.filter(
        thread=thread,
        read=False
    ).exclude(sender=request.user)
    
    # Mark them as read
    update_count = unread_messages.count()
    
    # Use update for better performance instead of iterating
    unread_messages.update(read=True)
    
    return Response({
        "status": "success",
        "detail": f"Marked {update_count} messages as read",
        "thread_id": thread_id,
        "unread_count": 0
    }, status=status.HTTP_200_OK)