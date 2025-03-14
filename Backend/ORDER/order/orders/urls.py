from django.urls import path, include
from .views import OrdersViewSet
from rest_framework.routers import DefaultRouter


app_name = 'orders'

router = DefaultRouter()
router.register(r'', OrdersViewSet, basename='orders')

urlpatterns = [
    # path('', OrdersViewSet.get_orders, name='order_list'),
    path('', include(router.urls)),
    path('create/', OrdersViewSet.create_order, name='order_create'),
    # path('', OrdersViewSet.list, name='list_orders'),
    path('<int:pk>/update/', OrdersViewSet.update_order, name='order_update'),
    path('<int:pk>/delete/', OrdersViewSet.delete_order, name='order_delete'),
]