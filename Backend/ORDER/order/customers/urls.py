from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomerViewSet, FoodProductViewSet, OrderViewSet, OrderItemViewSet

router = DefaultRouter()
router.register(r'customers', CustomerViewSet)
router.register(r'products', FoodProductViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
