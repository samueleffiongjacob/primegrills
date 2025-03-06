from rest_framework import serializers
from filemanager.models import StoredFile

class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = StoredFile
        fields = ["id", "file", "uploaded_at"]
   
