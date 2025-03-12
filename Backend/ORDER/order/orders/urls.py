from django.urls import path
from .views import OrdersViewSet

app_name = 'orders'

urlpatterns = [
    # path('', OrdersViewSet.get_orders, name='order_list'),
    path('create/', OrdersViewSet.create_order, name='order_create'),
    path('<int:pk>/', OrdersViewSet.get_orders, name='order_detail'),
    path('<int:pk>/update/', OrdersViewSet.update_order, name='order_update'),
    path('<int:pk>/delete/', OrdersViewSet.delete_order, name='order_delete'),
]