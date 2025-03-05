from django.contrib.auth import get_user_model
from rest_framework.serializers import ModelSerializer

User = get_user_model()

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'phone', 'address', 'name', 'profileImage')

    def create(self, validated_data):
        print('here')
        staff = User.objects.create_user(**validated_data)
        return staff
