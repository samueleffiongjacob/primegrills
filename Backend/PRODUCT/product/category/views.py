from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Category
from .serializers import CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def create(self, request, *args, **kwargs):
        """Handles category creation with a success message"""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(
            {"message": f"Category '{category.name}' created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        """Handles category updates with a success message"""
        category = self.get_object()
        serializer = self.get_serializer(category, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(
            {"message": f"Category '{category.name}' updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK
        )
    
    def partial_update(self, request, *args, **kwargs):  # ✅ Add PATCH support
        category = self.get_object()
        serializer = self.get_serializer(category, data=request.data, partial=True)  # Partial update
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        return Response(
            {"message": f"Category '{category.name}' partially updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    def destroy(self, request, *args, **kwargs):
        """Handles category deletion with a success message"""
        category = self.get_object()
        category_name = category.name
        category.delete()
        return Response(
            {"message": f"Category '{category_name}' deleted successfully"},
            status=status.HTTP_200_OK
        )
