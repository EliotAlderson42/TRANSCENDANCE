from rest_framework.response import Response
from rest_framework.decorators import api_view
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

@api_view(['GET'])
def game_data(request, game_id):
	game = PongGame.objects.get(id=game_id)
	game.update_position()
	game.save()
	data = {
		'ball': {'x': game.ball_x, 'y' : game.ball_y},
		'left_paddle': {'y': game.left_paddle_y},
		'right_paddle': {'y': game.right_paddle_y},
		'score': {'left': game.left_score, 'right': game.right_score}
	}
	return Response(data)

@api_view(['POST'])
def player_action(request, game_id):
	game = PongGame.objects.get(id=game_id)
	action = request.data.get('action')
	player = request.data.get('player')

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
	game.save()
	return Response({"message": "Action Received"})

# @api_view(['POST'])
# def update_game(request, game_id):
# 		game = PongGame.objects.get(id=game_id)
# 		game.update_positions()
# 		game.save()
# 		return Response({"messsage": "Game Updated"})