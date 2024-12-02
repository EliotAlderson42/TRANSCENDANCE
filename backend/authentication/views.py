from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import login, logout, authenticate, get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt
from django.db.models import Q
from .serializers import UserSerializer, FriendshipSerializer
from .models import Friendship, User
from django.middleware.csrf import get_token
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.utils import timezone
from datetime import datetime
from django.shortcuts import redirect
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .oauth42 import get_42_auth_url, get_42_token, get_42_user_info, FT_TOKEN_URL, FT_UID, FT_SECRET, FT_REDIRECT_URI, FT_API_URL
from .decorators import verify_auth
from urllib.parse import quote
import requests
import json
import base64
import os

User = get_user_model()

def get_csrf_token(request):
    return JsonResponse({'csrfToken': get_token(request)})

@api_view(['GET'])
@verify_auth
def protected_route(request):
    # Votre logique ici
    return Response({'message': 'Route protégée accessible'})

@api_view(['GET'])
def oauth42_login(request):
    """Redirige vers la page de login 42"""
    auth_url = get_42_auth_url()
    return Response({'auth_url': auth_url})

@api_view(['GET'])
def oauth42_callback(request):
    code = request.GET.get('code')
    if not code:
        return redirect('http://localhost:5500/?error=no_code')
    
    try:
        # Obtenir le token
        token_response = requests.post(FT_TOKEN_URL, data={
            'grant_type': 'authorization_code',
            'client_id': FT_UID,
            'client_secret': FT_SECRET,
            'code': code,
            'redirect_uri': FT_REDIRECT_URI
        })
        
        token_data = token_response.json()
        if 'access_token' not in token_data:
            return redirect('http://localhost:5500/?error=token_failed')
        
        # Get user info
        headers = {'Authorization': f'Bearer {token_data["access_token"]}'}
        user_response = requests.get(f'{FT_API_URL}/me', headers=headers)
        user_info = user_response.json()
        
        # Créer/mettre à jour l'utilisateur
        user, created = User.objects.get_or_create(
            username=user_info['login'],
            defaults={
                'email': user_info.get('email', ''),
                'display_name': user_info.get('displayname', user_info['login'])
            }
        )

        if not created:
            user.email = user_info.get('email', '')
            user.display_name = user_info.get('displayname', user_info['login'])
            user.save()

        login(request, user)

        # Mettre à jour le statut en ligne
        user.is_online = True
        user.last_seen = timezone.now()
        user.save()
        
        # Préparer les données utilisateur
        user_data = {
            'id': user.id,
            'username': user.username,
            'display_name': user.display_name,
            'email': user.email,
            'isLoggedIn': True,
            'token': token_data['access_token']
        }

        # Assurer un JSON propre
        user_json = json.dumps(user_data, ensure_ascii=True)
        encoded_data = base64.b64encode(user_json.encode('utf-8')).decode('utf-8')
        response = redirect(f'http://localhost:5500/#auth={encoded_data}')
        
        return response
    
    except Exception as e:
        print("Error details:", str(e))
        import traceback
        traceback.print_exc()
        return redirect('http://localhost:5500/?error=authentication_failed')
        
@csrf_exempt
@api_view(['POST'])
def register_api(request):
    print("Received data:", request.data)
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        try:
            user = serializer.save()
            login(request, user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            print(f"Error creating user: {str(e)}")
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    print("Validation errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login_api(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@verify_auth
def user_info(request):
    if request.user.is_authenticated:
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    return Response({'error': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@verify_auth
def update_profile(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    display_name = request.data.get('display_name')
    if not display_name:
        return Response({'detail': 'Display name is required'}, status=status.HTTP_400_BAD_REQUEST)

    # Vérifier si le display_name est déjà pris par un autre utilisateur
    try:
        if User.objects.exclude(id=request.user.id).filter(display_name=display_name).exists():
            return Response({'detail': 'This display name is already taken'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.display_name = display_name
        request.user.save()

        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    except Exception as e:
        print(f"Error updating profile: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    pass

@api_view(['POST'])
@verify_auth
def update_avatar(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'Not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

    if 'avatar' not in request.FILES:
        return Response({'detail': 'No avatar file provided'}, status=status.HTTP_400_BAD_REQUEST)

    avatar = request.FILES['avatar']
    
    # Vérifier le type de fichier
    allowed_types = ['image/jpeg', 'image/png', 'image/gif']
    if avatar.content_type not in allowed_types:
        return Response({'detail': 'Invalid file type'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Supprimer l'ancien avatar s'il existe
        if request.user.avatar:
            try:
                if os.path.isfile(request.user.avatar.path):
                    os.remove(request.user.avatar.path)
            except Exception as e:
                print(f"Error deleting old avatar: {e}")

        # Générer un nom de fichier unique
        ext = os.path.splitext(avatar.name)[1]
        filename = f'avatars/user_{request.user.id}_{os.urandom(8).hex()}{ext}'

        # Sauvegarder le nouveau fichier
        path = default_storage.save(filename, ContentFile(avatar.read()))
        request.user.avatar = path
        request.user.save()

        # Créer l'URL complète
        avatar_url = f"http://localhost:8000/media/{path}"

        # Retourner toutes les informations de l'utilisateur mises à jour
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'display_name': request.user.display_name,
            'avatar_url': avatar_url,
            'wins': request.user.wins,
            'losses': request.user.losses
        })
    except Exception as e:
        print(f"Error updating avatar: {str(e)}")
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@verify_auth  # Assurez-vous que verify_auth est après api_view
def logout_api(request):
    try:
        # Debug pour voir ce qui arrive
        print("Headers:", request.headers)
        print("User:", request.user)
        print("Auth:", request.auth)

        if request.user.is_authenticated:
            user_id = request.user.id
            channel_layer = get_channel_layer()
            
            async_to_sync(channel_layer.group_send)(
                "users",
                {
                    "type": "user_status",
                    "user_id": str(user_id),
                    "is_online": False,
                    "timestamp": timezone.now().isoformat() 
                }
            )
            
            request.user.is_online = False
            request.user.save()
            logout(request)
        
        return Response({'message': 'Successfully logged out'})
    except Exception as e:
        print("Logout error:", str(e))  # Debug pour voir l'erreur
        return Response({'error': str(e)}, status=500)

@api_view(['GET'])
@verify_auth
def search_users(request):
    """Recherche des utilisateurs par nom d'utilisateur ou display_name"""
    query = request.GET.get('query', '')
    if not query:
        return Response([])
    
    users = User.objects.filter(
        Q(username__icontains=query) | Q(display_name__icontains=query)
    ).exclude(id=request.user.id)[:10]  # Limite à 10 résultats
    
    return Response(UserSerializer(users, many=True).data)

@api_view(['POST'])
@verify_auth
def send_friend_request(request):
    """Envoyer une demande d'ami"""
    receiver_id = request.data.get('receiver_id')
    try:
        receiver = User.objects.get(id=receiver_id)
        friendship, created = Friendship.objects.get_or_create(
            sender=request.user,
            receiver=receiver,
            defaults={'status': 'pending'}
        )
        if not created:
            return Response({'detail': 'Friend request already sent'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        return Response({'detail': 'Friend request sent'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, 
                       status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@verify_auth
def get_friends(request):
    friendships = Friendship.objects.filter(
        (Q(sender=request.user) | Q(receiver=request.user)) &
        Q(status='accepted')
    )
    
    friends = []
    for friendship in friendships:
        friend = friendship.receiver if friendship.sender == request.user else friendship.sender
        print(f"Friend {friend.username} online status: {friend.is_online}")  # Log de débogage
        friends.append({
            'id': friend.id,
            'username': friend.username,
            'display_name': friend.display_name,
            'avatar_url': friend.avatar_url if hasattr(friend, 'avatar_url') else None,
            'is_online': friend.is_online
        })
    
    print("Returning friends:", friends)  # Log de débogage
    return Response(friends)

@api_view(['GET'])
@verify_auth
def get_friend_requests(request):
    if not request.user.is_authenticated:
        return Response([])  # Retourne une liste vide si non authentifié
    """Obtenir les demandes d'ami en attente"""
    pending_requests = Friendship.objects.filter(
        receiver=request.user,
        status='pending'
    )
    return Response(FriendshipSerializer(pending_requests, many=True).data)

@api_view(['POST'])
@verify_auth  # Ajouter ce décorateur s'il n'y est pas déjà
def handle_friend_request(request):
    try:
        friendship_id = request.data.get('friendship_id')
        action = request.data.get('action')  # 'accept' ou 'reject'
        
        friendship = Friendship.objects.get(
            id=friendship_id, 
            receiver=request.user,
            status='pending'
        )
        friendship.status = 'accepted' if action == 'accept' else 'rejected'
        friendship.save()
        return Response({'detail': f'Friend request {action}ed'})
    except Friendship.DoesNotExist:
        return Response({'detail': 'Friend request not found'}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print(f"Error in handle_friend_request: {str(e)}")  # Pour debug
        return Response({'detail': str(e)}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@verify_auth
def get_online_users(request):
    if not request.user.is_authenticated:
        return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    online_users = User.objects.filter(
        Q(is_online=True) | 
        Q(last_seen__gte=timezone.now() - timezone.timedelta(minutes=5))
    )
    serializer = UserSerializer(online_users, many=True)
    return Response(serializer.data)

