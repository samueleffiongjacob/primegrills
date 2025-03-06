from rest_framework.response import Response
from rest_framework.views import APIView
from .models import QueryCategoryImage, QueryMenuImage
from .serializer import QueryCategoryImageSerializer, QueryMenuImageSerializer

class QueryCategoryImageView(APIView):
    def get(self, request):
        category_images = QueryCategoryImage.objects.all()
        serializer = QueryCategoryImageSerializer(category_images, many=True)
        return Response(serializer.data)

class QueryMenuImageView(APIView):
    def get(self, request):
        menu_images = QueryMenuImage.objects.all()
        serializer = QueryMenuImageSerializer(menu_images, many=True)
        return Response(serializer.data)
