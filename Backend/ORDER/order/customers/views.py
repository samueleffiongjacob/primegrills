import uuid
from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from django.db import transaction
from .models import Customer, FoodProduct, CustomerOrder, CustomerOrderItem
from .serializers import CustomerSerializer, FoodProductSerializer, CustomerOrderSerializer, CustomerOrderItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'email', 'phone']
    filterset_fields = ['city', 'state']

    @action(detail=False, methods=['post'])
    def get_or_create(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        customer, created = Customer.objects.get_or_create(
            email=email,
            defaults=request.data
        )
        
        if not created:
            # Update existing customer info if provided
            for field in ['name', 'phone', 'address', 'city', 'state', 'zip']:
                if field in request.data:
                    setattr(customer, field, request.data[field])
            customer.save()
            
        serializer = self.get_serializer(customer)
        return Response({
            'customer': serializer.data,
            'created': created
        })

class FoodProductViewSet(viewsets.ModelViewSet):
    queryset = FoodProduct.objects.all()
    serializer_class = FoodProductSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['name', 'description']
    filterset_fields = ['is_available']

class OrderViewSet(viewsets.ModelViewSet):
    queryset = CustomerOrder.objects.all()
    serializer_class = CustomerOrderSerializer
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    filterset_fields = ['status', 'customer']

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        order = self.get_object()
        status = request.data.get('status')
        if status in dict(Order.STATUS_CHOICES):
            order.status = status
            order.save()
            return Response({'status': 'status updated'})
        return Response({'error': 'invalid status'}, status=400)

    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        orders = CustomerOrder.objects.filter(customer=request.user)
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    @transaction.atomic
    def create_with_items(self, request):
        # Get or create customer
        # customer_data = request.data.get('customer')
        # if not customer_data or 'email' not in customer_data:
        #     return Response({'error': 'Customer email is required'}, 
        #                   status=status.HTTP_400_BAD_REQUEST)

        # customer, _ = Customer.objects.get_or_create(
        #     email=customer_data['email'],
        #     defaults=customer_data
        # )

        customer = request.user

        # Create order
        order_data = {
            'customer': customer.id,
            'special_instructions': request.data.get('special_instructions', ''),
            'status': 'PENDING',
            'payment': 'PENDING',
            'total_amount': 0  # Will be calculated from items
        }
        
        order_serializer = CustomerOrderSerializer(data=order_data)
        if not order_serializer.is_valid():
            return Response(order_serializer.errors, 
                          status=status.HTTP_400_BAD_REQUEST)
        order = order_serializer.save()

        # Create order items
        items_data = request.data.get('items', [])
        if not items_data:
            order.delete()
            return Response({'error': 'Order items are required'}, 
                          status=status.HTTP_400_BAD_REQUEST)

        total_amount = 0
        order_items = []

        for item_data in items_data:
            try:
                product = FoodProduct.objects.get(id=item_data['food_product'])
                quantity = int(item_data['quantity'])
                
                if not product.is_available:
                    raise ValueError(f"Product {product.name} is not available")

                item_data.update({
                    'order': order.id,
                    'price_at_time': product.price,
                    'subtotal': product.price * quantity
                })
                
                item_serializer = CustomerOrderItemSerializer(data=item_data)
                if item_serializer.is_valid():
                    order_items.append(item_serializer.save())
                    total_amount += item_data['subtotal']
                else:
                    raise ValueError(f"Invalid item data: {item_serializer.errors}")

            except Exception as e:
                # Rollback by deleting the order if any item fails
                order.delete()
                return Response({'error': str(e)}, 
                              status=status.HTTP_400_BAD_REQUEST)

        # Update order total
        order.total_amount = total_amount
        self.perform_create(order)

        return Response({
            'order': CustomerOrderSerializer(order).data,
            'items': CustomerOrderItemSerializer(order_items, many=True).data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['put'])
    def update_payment_status(self, request, pk=None):
        order = self.get_object()
        payment_status = request.data.get('payment')
        if payment_status in dict(Order.PAY_STATS):
            order.payment = payment_status
            order.save()
            return Response({'status': 'payment status updated'})
        return Response({'error': 'invalid payment status'}, 
                       status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def pending_orders(self, request):
        orders = CustomerOrder.objects.filter(status='PENDING')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def unpaid_orders(self, request):
        orders = CustomerOrder.objects.filter(payment='PENDING')
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def all_orders(self, request):
        orders = CustomerOrder.objects.all()
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            order_id=order_id
        )

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = CustomerOrderItem.objects.all()
    serializer_class = CustomerOrderItemSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['order', 'food_product']
