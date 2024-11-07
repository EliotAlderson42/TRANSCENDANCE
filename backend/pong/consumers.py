import json
import random
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import sync_to_async , async_to_sync

class PongConsumer(WebsocketConsumer):
	def connect(self):
		self.game_id = self.scope['url_route']['kwargs']['game_id']
		self.room_group_name = f'game_{self.game_id}'

		async_to_sync(self.channel_layer.group_add)(
			self.room_group_name,
			self.channel_name
		)
		self.accept()

	def disconnect(self, close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.room_group_name,
			self.channel_name
		)
	
	def receive(self, text_data):
		data = json.loads(text_data)

		async_to_sync(self.channel_layer.group_send)(
			self.room_group_name,
			{
				'type': 'game_update',
				'message': data
			}
		)

	def game_update(self, event):
		message = event['message']
		self.send(text_data=json.dumps({
			'message': message
		}))

	