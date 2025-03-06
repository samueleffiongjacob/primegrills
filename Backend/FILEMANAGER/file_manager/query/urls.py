from django.urls import path
from .views import QueryCategoryImageView, QueryMenuImageView

urlpatterns = [
    path("query/category-images/", QueryCategoryImageView.as_view(), name="query_category_images"),
    path("query/menu-images/", QueryMenuImageView.as_view(), name="query_menu_images"),
]
