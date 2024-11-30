# authentication/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Friendship

User = get_user_model()

from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()
    online_status = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email', 'display_name', 'avatar_url', 'wins', 'losses', 'is_online', 'online_status', 'last_seen')
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'email': {'required': False},
            'display_name': {'required': False}
        }

    def get_online_status(self, obj):
        return {
            'is_online': obj.is_online,
            'is_recently_online': obj.is_recently_online,
            'last_seen': obj.last_seen
        }

    def get_avatar_url(self, obj):
        if obj.avatar:
            return f"http://localhost:8000/media/{obj.avatar}"
        return None

    def create(self, validated_data):
        password = validated_data.pop('password')
        display_name = validated_data.pop('display_name', None)
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        if display_name:
            user.display_name = display_name
            user.save()
        return user
    
class FriendshipSerializer(serializers.ModelSerializer):
    sender_info = UserSerializer(source='sender', read_only=True)
    receiver_info = UserSerializer(source='receiver', read_only=True)

    class Meta:
        model = Friendship
        fields = ('id', 'sender_info', 'receiver_info', 'status', 'created_at', 'updated_at')