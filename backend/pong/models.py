from django.db import models

# Create your models here.

class Users(models.Model):
	name = models.CharField(max_length = 128)
	password = models.CharField(max_length = 128)
	win = models.IntegerField(default = 0)
	loose = models.IntegerField(default = 0)
	winrate = models.FloatField(default = 0.0)
	images = models.ImageField(upload_to="images", blank=True, null=True)
