from category.models import Category
from menu.models import Menu
from query.models import QueryCategory, QueryMenu

def update_query_tables():
    """Fetches Category & Menu data and updates Query tables."""
    
    # Update QueryCategory
    QueryCategory.objects.all().delete()  # Clear old data
    categories = Category.objects.all()
    for category in categories:
        QueryCategory.objects.create(
            category_id=category.id,
            name=category.name,
            image_url=category.image_url
        )

    # Update QueryMenu
    QueryMenu.objects.all().delete()  # Clear old data
    menus = Menu.objects.select_related("category").all()
    for menu in menus:
        QueryMenu.objects.create(
            menu_id=menu.id,
            category_id=menu.category.id,
            category_name=menu.category.name,
            menu_name=menu.name,
            image_url=menu.image_url,
            status=menu.status,
            quantity=menu.quantity
        )

    print("Query tables updated successfully!")
