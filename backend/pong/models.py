from django.db import models
from datetime import datetime
from django.contrib.auth.models import User

# Create your models here.

class PongGame(models.Model): #creation du model qui va contenir les data de la partie
	player_left = models.ForeignKey(User, related_name='games_left', on_delete=models.SET_NULL, null=True)
	player_right = models.ForeignKey(User, related_name='games_right', on_delete=models.SET_NULL, null=True)
	ball_x = models.IntegerField(default=400) #pos horizontal de la bal
	ball_y = models.IntegerField(default=300) #vertical
	ball_speed_x = models.IntegerField(default=10) #vitesse hoizontal de la bal
	ball_speed_y = models.IntegerField(default=10) #vertical
	left_paddle_y = models.IntegerField(default=250) #pos du bas de la raquette de gauche
	right_paddle_y = models.IntegerField(default=250) # droite
	left_score = models.IntegerField(default=0)
	right_score = models.IntegerField(default=0)
	created_at = models.DateTimeField(auto_now_add=True)
	is_active = models.BooleanField(default=False)
	right_actif = models.BooleanField(default=False)
	left_actif = models.BooleanField(default=False)

	def reset_ball(self):
		self.ball_x = 400
		self.ball_y = 300
		self.ball_speed_x +=1
		self.ball_speed_y += 1

	def update_position(self):
		self.ball_x += self.ball_speed_x
		self.ball_y += self.ball_speed_y

		if self.ball_y <= 0 or self.ball_y >= 600:#si la balle atteint le haut ou le bas du canvas la fait changer de sens
			self.ball_speed_y *= -1
		
		if self.ball_x <= 20 and self.left_paddle_y <= self.ball_y <= self.left_paddle_y + 100: #si la balle touche la raquette gauche
			self.ball_speed_x *= -1
		elif self.ball_x >= 780 and self.right_paddle_y <= self.ball_y <= self.right_paddle_y + 100: #droite
			self.ball_speed_x *= -1

		if self.ball_x <= 0:#verifie si quelqu'un a marquer
			self.right_score += 1
			self.reset_ball()
		elif self.ball_x >= 800:
			self.left_score += 1
			self.reset_ball()
