from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.views import APIView
from .models import QueryCategory, QueryMenu
from .query_serializer import QueryCategorySerializer, QueryMenuSerializer

class QueryCategoryView(APIView):
    def get(self, request):
        categories = QueryCategory.objects.all()
        serializer = QueryCategorySerializer(categories, many=True)
        return Response(serializer.data)

class QueryMenuView(APIView):
    def get(self, request):
        menus = QueryMenu.objects.all()
        serializer = QueryMenuSerializer(menus, many=True)
        return Response(serializer.data)

