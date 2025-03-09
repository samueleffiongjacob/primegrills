from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import datetime
import uuid
from .models import PaymentMethod, Transaction, DailyReport
from .serializers import PaymentMethodSerializer, TransactionSerializer, DailyReportSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
    permission_classes = [permissions.IsAuthenticated]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        reference_number = f"TXN-{uuid.uuid4().hex[:8].upper()}"
        serializer.save(
            processed_by=self.request.user,
            reference_number=reference_number
        )

    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        transaction = self.get_object()
        # Add payment processing logic here
        transaction.status = 'COMPLETED'
        transaction.save()
        return Response({'status': 'payment processed'})

class DailyReportViewSet(viewsets.ModelViewSet):
    queryset = DailyReport.objects.all()
    serializer_class = DailyReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        transactions = Transaction.objects.filter(
            created_at__date=today,
            status='COMPLETED'
        )
        total_sales = sum(t.amount for t in transactions)
        report, created = DailyReport.objects.get_or_create(
            date=today,
            defaults={
                'total_sales': total_sales,
                'total_transactions': transactions.count(),
                'created_by': request.user
            }
        )
        serializer = self.get_serializer(report)
        return Response(serializer.data)

class 
