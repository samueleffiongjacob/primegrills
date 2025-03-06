from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        if "file" in request.FILES:
            image_file = request.FILES["file"]
            file_path = default_storage.save(f"uploads/{image_file.name}", ContentFile(image_file.read()))
            
            return Response({"message": "Image stored successfully", "file_path": file_path}, status=status.HTTP_201_CREATED)
        
        return Response({"error": "Invalid request"}, status=status.HTTP_400_BAD_REQUEST)
