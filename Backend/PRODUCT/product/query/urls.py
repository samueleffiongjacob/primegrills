from django.urls import path
from .views import QueryCategoryView, QueryMenuView

urlpatterns = [
    path("query/categories/", QueryCategoryView.as_view(), name="query_categories"),
    path("query/menus/", QueryMenuView.as_view(), name="query_menus"),
]
