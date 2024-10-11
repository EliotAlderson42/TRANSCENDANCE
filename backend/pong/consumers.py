import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer

class PongConsumer(AsyncWebsocketConsumer):
    players = {}  # Dictionnaire pour stocker les joueurs
    ball_position = {'x': 400, 'y': 200}  # Position initiale de la balle
    ball_speed = {'x': 5, 'y': 2}  # Vitesse initiale de la balle
    game_started = False  # Indicateur pour savoir si le jeu a commencé

    async def connect(self):
        await self.accept()
        self.players[self.channel_name] = {'playerPaddleY': 200}  # Position initiale de la raquette
        await self.check_start_game()  # Vérifier si nous pouvons démarrer le jeu

    async def disconnect(self, close_code):
        # Supprimer le joueur de la liste des joueurs
        del self.players[self.channel_name]
        await self.check_start_game()  # Vérifiez si le jeu doit être arrêté

    async def receive(self, text_data):
        data = json.loads(text_data)

        if data['action'] == 'update':
            if self.game_started:
                # Mettez à jour l'état du jeu avec les données du joueur
                self.players[self.channel_name]['playerPaddleY'] = data['data']['playerPaddleY']
                await self.update_game_state()

    async def check_start_game(self):
        # Démarrer le jeu si deux joueurs sont connectés
        if len(self.players) == 2 and not self.game_started:
            self.game_started = True
            asyncio.create_task(self.run_game_loop())  # Démarrer la boucle de jeu
            await self.send_game_state_to_all()  # Informer tous les joueurs que le jeu commence

    async def run_game_loop(self):
        while self.game_started:
            await self.update_game_state()  # Mettre à jour l'état du jeu
            await asyncio.sleep(0.016)  # Environ 60 FPS

    async def update_game_state(self):
        # Mettre à jour la position de la balle
        self.ball_position['x'] += self.ball_speed['x']
        self.ball_position['y'] += self.ball_speed['y']

        # Collision avec le haut et le bas
        if self.ball_position['y'] + 10 >= 400 or self.ball_position['y'] - 10 <= 0:
            self.ball_speed['y'] = -self.ball_speed['y']

        # Collision avec les raquettes
        player1_paddle_y = self.players.get(list(self.players.keys())[0], {}).get('playerPaddleY', 200)
        player2_paddle_y = self.players.get(list(self.players.keys())[1], {}).get('playerPaddleY', 200)

        # Vérifiez les collisions avec les raquettes
        if (self.ball_position['x'] - 10 <= 10 and player1_paddle_y < self.ball_position['y'] < player1_paddle_y + 75) or \
           (self.ball_position['x'] + 10 >= 790 and player2_paddle_y < self.ball_position['y'] < player2_paddle_y + 75):
            self.ball_speed['x'] = -self.ball_speed['x']

        # Préparez l'état du jeu à envoyer
        game_state = {
            'data': {
                'playerPaddleY': player1_paddle_y,
                'opponentPaddleY': player2_paddle_y,
                'ballX': self.ball_position['x'],
                'ballY': self.ball_position['y'],
            }
        }

        # Envoyez les données à tous les clients connectés
        await self.send_game_state_to_all(game_state)

    async def send_game_state_to_all(self, game_state):
        # Envoyer l'état de jeu à tous les joueurs
        for player in self.players.keys():
            await self.send(player, game_state)

    async def send_game_state(self, event):
        game_state = event['game_state']
        await self.send(text_data=json.dumps(game_state))
