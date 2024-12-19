from rest_framework.response import Response
from rest_framework.decorators import api_view
from time import sleep
import json
from django.http import StreamingHttpResponse
from .models import *
from .game_service import find_or_create_game 
from django.shortcuts import render

# Create your views here.

def home(request):
    return render(request, 'index.html')

@api_view(['POST'])
def start_game(request):
	player = None #request.user pour plus tard quand l'authetification sera faite
	game, player_side = find_or_create_game(player)

	return Response({
		"game_id": game.id,
		'player_side': player_side 
		# if game.player_left == player else 'right'
		})

# @api_view(['GET'])
# def game_data(request, game_id):
# 	game = PongGame.objects.get(id=game_id)
# 	game.update_position()
# 	game.save()
# 	data = {
# 		'ball': {'x': game.ball_x, 'y' : game.ball_y},
# 		'left_paddle': {'y': game.left_paddle_y},
# 		'right_paddle': {'y': game.right_paddle_y},
# 		'score': {'left': game.left_score, 'right': game.right_score}
# 	}
# 	return Response(data)

# @api_view(['POST'])
# def player_action(request, game_id):
# 	game = PongGame.objects.get(id=game_id)
# 	action = request.data.get('action')
#     player = request.data.get('player')
#     print(f"Player: {player}, Action: {action}")
# 	if player == 'left':
# 		if action == 'moove_up':
# 			game.left_paddle_y = max(game.left_paddle_y - 10, 0)
# 		elif action == 'moove_down':
# 			game.left_paddle_y = min(game.left_paddle_y + 10, 500)
# 	elif player == 'right':
# 		if action == 'moove_up':
# 			game.right_paddle_y = max(game.right_paddle_y - 10, 0)
# 		elif action == 'moove_down':
# 			game.right_paddle_y = min(game.right_paddle_y + 10, 500)
# 	game.save()
#     print(f"Player: {player}, Action: {action}")
# 	return Response({"message": "Action Received"})

@api_view(['POST'])
def player_action(request, game_id):
    print(f"Request received for game_id: {game_id}")
    print(f"Request data: {request.data}")

    try:
        game = PongGame.objects.get(id=game_id)
    except PongGame.DoesNotExist:
        return Response({"error": "Game not found"}, status=404)

    action = request.data.get('action')
    player = request.data.get('player')

    if not action or not player:
        return Response({"error": "Missing 'action' or 'player'"}, status=400)

    print(f"Player: {player}, Action: {action}")
    print(f"Data left before : {game.left_paddle_y}")
    print(f"Data right before : {game.right_paddle_y}")


    if player == 'left':
        if action == 'moove_up':
            game.left_paddle_y = max(game.left_paddle_y - 10, 0)
        elif action == 'moove_down':
            game.left_paddle_y = min(game.left_paddle_y + 10, 500)
    elif player == 'right':
        if action == 'moove_up':
            game.right_paddle_y = max(game.right_paddle_y - 10, 0)
        elif action == 'moove_down':
            game.right_paddle_y = min(game.right_paddle_y + 10, 500)
    print(f"Data left after : {game.left_paddle_y}")
    print(f"Data right after : {game.right_paddle_y}")
    
    # game.save()
    # return Response({"error": "Invalid player"}, status=400)

    game.save()
    print(f"Updated game state: {game}")
    return Response({"message": "Action Received"})

def game_data(request, game_id):
    """
    Envoie des mises à jour en temps réel pour un jeu spécifique via SSE.
    """
    try:
        game = PongGame.objects.get(id=game_id)
    except PongGame.DoesNotExist:
        return StreamingHttpResponse("Game not found", status=404)

    def event_stream():
        while True:
            # Mise à jour de l'état du jeu
            game.refresh_from_db()
            game.update_position()
            game.save()

            # Préparation des données à envoyer
            data = {
                'ball': {'x': game.ball_x, 'y': game.ball_y},
                'left_paddle': {'y': game.left_paddle_y},
                'right_paddle': {'y': game.right_paddle_y},
                'score': {'left': game.left_score, 'right': game.right_score}
            }

            # Envoi des données au client
            yield f"data: {json.dumps(data)}\n\n"

            # Délai avant la prochaine mise à jour (fréquence d'envoi)
            sleep(1 / 60)  # 60 FPS

    # Configuration de la réponse en streaming
    response = StreamingHttpResponse(event_stream(), content_type='text/event-stream')
    response['Cache-Control'] = 'no-cache'
    response['X-Accel-Buffering'] = 'no'  # Important pour certains serveurs comme Nginx
    return response

# @api_view(['POST'])
# def update_game(request, game_id):
# 		game = PongGame.objects.get(id=game_id)
# 		game.update_positions()
# 		game.save()
# 		return Response({"messsage": "Game Updated"})