import uuid
from django.shortcuts import get_object_or_404, render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
from django.db import transaction

from customers.models import FoodProduct
from pos.models import Transaction as PosTransaction
from .models import Orders
from .serializers import OrdersSerializer, OrderItemsSerializer
from django.contrib.contenttypes.models import ContentType


class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all()
    serializer_class = OrdersSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def process_order(self, request):
        order = self.queryset.filter(id=request.data.get('id'))
        serialized = self.serializer_class(order)
        # Add order processing logic here
        if not serialized.is_valid():
            return Response(serialized.error, status=status.HTTP_400_BAD_REQUEST)
        serialized.save( 
            status='complete'
        )
        return Response({'status': 'order processed'}, status=status.HTTP_202_ACCEPTED)
    
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
        
        # Add order processing logic here
        user = request.user

        content_type = ContentType.objects.get(model=str(user.type))

        

        orders = {
            'content_type': content_type,
            'user_id': user.id,
            'date': datetime.now(),
            'time': timezone.now().time(),
            'status': 'PENDING',
            'total': request.data.get('total') or 0,
            }
        
        if request.data.get('orderType'):
            orders['order_type'] = request.data.get('orderType')
        

        order = OrdersSerializer(data=orders)

        if not order.is_valid():
            return Response(order.errors, status=status.HTTP_400_BAD_REQUEST)
        
        if not request.data.get('order_id'):
            self.perform_create(order)
        else:
            order_id = request.data.get('order_id')
            order.save(
                order_id=order_id
            )
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
                item = OrderItemsSerializer(data=item_data)
                if not item.is_valid():
                    order.delete()
                    return Response(item.errors, status=status.HTTP_400_BAD_REQUEST)
                item.save()
                total += item_data['price'] * item_data['quantity']
                order_items.append(item.instance)
            except Exception as e:
                order.delete()
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        order.data.total = total
        order.save()

        return Response({'status': 'order created'}, status=status.HTTP_201_CREATED)
    
    # @action(detail=True, methods=['get'])
    # def get_orders(self, request):
    #     try:
    #         order = Orders.objects.all()
    #         serializer = OrdersSerializer(order)
    #         return Response(serializer.data)
        
    #     except Exception as e:
    #         return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['put'])
    def update_order(self, request, pk=None):
        try:
            if pk is not None:
                order = Orders.objects.filter(id=pk)
            else:
                return Response({'error': 'no ID'}, status=status.HTTP_400_BAD_REQUEST)
            serializer = OrdersSerializer(order, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['delete'])
    def delete_order(self, request, pk=None):
        if pk is not None:
            order = get_object_or_404(Orders, pk=pk)
            order.delete()
            return Response({'status': 'order deleted'}, status=status.HTTP_204_NO_CONTENT)
        
        else:
            return Response({'error': 'no ID'}, status=status.HTTP_400_BAD_REQUEST)
        

    def perform_create(self, serializer):
        order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            order_id=order_id
        )
        

# Create your views here.
