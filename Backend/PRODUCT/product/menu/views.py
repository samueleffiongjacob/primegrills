from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Menu
from .serializers import MenuSerializer

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response(
            {"message": f"Menu item '{menu.name}' created successfully", "data": serializer.data},
            status=status.HTTP_201_CREATED
        )

    def update(self, request, *args, **kwargs):
        menu = self.get_object()
        serializer = self.get_serializer(menu, data=request.data, partial=False)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response(
            {"message": f"Menu item '{menu.name}' updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    def partial_update(self, request, *args, **kwargs):
        menu = self.get_object()
        serializer = self.get_serializer(menu, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        menu = serializer.save()
        return Response(
            {"message": f"Menu item '{menu.name}' partially updated successfully", "data": serializer.data},
            status=status.HTTP_200_OK
        )

    def destroy(self, request, *args, **kwargs):
        menu = self.get_object()
        menu_name = menu.name
        menu.delete()
        return Response({"message": f"Menu item '{menu_name}' deleted successfully"}, status=status.HTTP_200_OK)
