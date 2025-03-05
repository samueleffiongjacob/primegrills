#from django.shortcuts import render
from rest_framework import viewsets
from .models import Category
from .serializers import CategorySerializer
from .services.file_manager import send_image_to_file_manager
# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def perform_create(self, serializer):
        category = serializer.save()
        send_image_to_file_manager(category.name, category.image_url)

    def perform_update(self, serializer):
        category = serializer.save()
        send_image_to_file_manager(category.name, category.image_url)

