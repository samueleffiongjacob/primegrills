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
from rest_framework.exceptions import ValidationError


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

class ClientThreadsView(generics.ListAPIView):
    """
    Returns threads where at least one participant is a client
    """
    serializer_class = ThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Filter threads where at least one participant has a client user_type
        return Thread.objects.filter(
            participants__user_type='client'
        ).distinct().order_by('-created_at')
    
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


class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            # First check if content is a string and try to parse it
            content = request.data.get("content", {})
            
            # If content is already a string (which seems to be the case based on the error)
            if isinstance(content, str):
                try:
                    # Try to import json
                    import json
                    # Try to parse the string as JSON
                    content = json.loads(content)
                except json.JSONDecodeError:
                    # If it's not valid JSON, raise an error
                    raise ValidationError("Content must be valid JSON")
            
            # Validate required fields
            required_fields = ["firstName", "lastName", "email", "feedback"]
            for field in required_fields:
                if field not in content:
                    raise ValidationError(f"Missing required field: {field}")
            
            # Convert the feedback data to a descriptive sentence
            ratings_text = ""
            if "ratings" in content:
                ratings = []
                if "foodQuality" in content["ratings"]:
                    ratings.append(f"food quality: {content['ratings']['foodQuality']}/5")
                if "services" in content["ratings"]:
                    ratings.append(f"services: {content['ratings']['services']}/5")
                if "cleanliness" in content["ratings"]:
                    ratings.append(f"cleanliness: {content['ratings']['cleanliness']}/5")
                if "value" in content["ratings"]:
                    ratings.append(f"value: {content['ratings']['value']}/5")
                
                if ratings:
                    ratings_text = " Ratings: " + ", ".join(ratings) + "."
            
            visit_info = ""
            if "date" in content and content["date"]:
                visit_info += f" Visit date: {content['date']}."
            if "visitType" in content and content["visitType"]:
                visit_info += f" Visit type: {content['visitType']}."
            
            # Format as a sentence
            formatted_content = (
                f"Feedback from {content['firstName']} {content['lastName']} ({content['email']}):{visit_info}{ratings_text} "
                f"Feedback message: {content['feedback']}"
            )

            # Proceed with creating the message
            subject = "Restaurant Feedback"
            thread = Thread.objects.create()
            sender = request.user
            thread.participants.add(sender)
            
            # Find admin or staff users to add to the thread
            try:
                staff_users = User.objects.filter(user_type='staff')
                for staff in staff_users:
                    thread.participants.add(staff)
            except Exception as e:
                # Log the error but continue
                print(f"Error adding staff to thread: {str(e)}")
                pass

            message = Message.objects.create(
                sender=sender,
                thread=thread,
                subject=subject,
                content=formatted_content,
            )

            return Response(
                {"message": "Feedback submitted successfully", "message_id": message.id},
                status=status.HTTP_201_CREATED,
            )
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)