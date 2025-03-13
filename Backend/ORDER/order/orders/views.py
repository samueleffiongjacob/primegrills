import uuid
from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.db import transaction

from pos.models import Transaction as PosTransaction
from .models import Orders
from .serializers import OrdersSerializer


class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def process_order(self, request):
        order = self.get_object()
        # Add order processing logic here
        order.status = 'complete'
        order.save()
        return Response({'status': 'order processed'})
    
    @action(detail=False, methods=['get'])
    def cancel_order(self, request):
        order = self.get_object()
        # Add order processing logic here
        order.status = 'cancelled'
        order.reason = request.data.get('reason')
        order.save()
        return Response({'status': 'order cancelled'})
    
    @action(detail=False, methods=['post'])
    @transaction.atomic
    def create_order(self, request):
        order = self.get_object()
        # Add order processing logic here
        user = self.request.user

        orders = {
            'content_type': user.content_type,
            'object_id': user.id,
            'order_id': request.data.get('order_id'),
            'date': datetime.now(),
            'time': timezone.now().time(),
            'status': 'PENDING',
            'total': request.data.get('total') or 0,
            }
        order = OrdersSerializer(data=orders)
        
        if  not order.is_valid():
            return Response(order.errors, status=status.HTTP_400_BAD_REQUEST)
        
        order.save()

        items_data = request.data.get('items', [])
        if not items_data:
            order.delete()
            return Response({'error': 'Order items are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        total = 0
        order_items = []
        for item_data in items_data:
            try:
                food_product = FoodProduct.objects.get(id=item_data['food_product'])
                quantity = int(item_data['quantity'])
                item_data['order'] = order.id
                item = OrderItemSerializer(data=item_data)
                if not item.is_valid():
                    order.delete()
                    return Response(item.errors, status=status.HTTP_400_BAD_REQUEST)
                item.save()
                total += item_data['price'] * item_data['quantity']
                order_items.append(item.instance)
            except Exception as e:
                order.delete()
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        order.total = total
        order.save()

        return Response({'status': 'order created'}, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=['get'])
    def get_orders(self, request, pk=None):
        order = self.get_object()
        serializer = OrdersSerializer(order)
        return Response(serializer.data)
    
    @action(detail=True, methods=['put'])
    def update_order(self, request, pk=None):
        order = self.get_object()
        serializer = OrdersSerializer(order, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def delete_order(self, request, pk=None):
        order = self.get_object()
        order.delete()
        return Response({'status': 'order deleted'}, status=status.HTTP_204_NO_CONTENT)
    
        

# Create your views here.
