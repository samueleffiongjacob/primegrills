from filemanager.models import StoredFile
from .models import QueryCategoryImage, QueryMenuImage

def update_image_query_tables():
    """Fetch Category & Menu images and update Query tables."""
    
    # Update QueryCategoryImage
    QueryCategoryImage.objects.all().delete()
    category_images = StoredFile.objects.filter(file_type="category")
    for image in category_images:
        QueryCategoryImage.objects.create(
            category_id=image.entity_id,
            image_url=image.file_url
        )

    # Update QueryMenuImage
    QueryMenuImage.objects.all().delete()
    menu_images = StoredFile.objects.filter(file_type="menu")
    for image in menu_images:
        QueryMenuImage.objects.create(
            menu_id=image.entity_id,
            image_url=image.file_url
        )

    print("Image Query tables updated successfully!")
