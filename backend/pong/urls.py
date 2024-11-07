from django.urls import path
from .views import *

urlpatterns = [
	path('api/start-game/', start_game, name = "start_game"),
	path('api/game-data/<int:game_id>/', game_data, name="game_data"),  # Ajout de cette ligne
	path('api/player-action/<int:game_id>/', player_action, name='player_action'),
]