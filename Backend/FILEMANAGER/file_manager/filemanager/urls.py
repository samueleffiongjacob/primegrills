from django.urls import path
from filemanager.views.file_upload_views import FileUploadView

urlpatterns = [
    path("upload/", FileUploadView.as_view(), name="file-upload"),
]
