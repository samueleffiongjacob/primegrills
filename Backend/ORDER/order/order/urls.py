"""
URL configuration for order project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls
import customers
import pos
import orders


urlpatterns = [
    path('admin/', admin.site.urls),
    path('cutomers/', include(('customers.urls', 'customers'), namespace='customers')),
    path('pos/', include(('pos.urls', 'pos') , namespace='pos')),
    # path('api-auth/', include('rest_framework.urls')),  # Uncomment this line
    path('orders/', include(('orders.urls', 'orders') , namespace='orders')),
    path('docs/', include_docs_urls(title='Food Order API')),
]
