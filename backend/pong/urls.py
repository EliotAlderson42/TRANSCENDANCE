from django.urls import path
from .views import pong_view

urlpatterns = [
    path('pong/', pong_view, name='pong_view'),  # URL pour accéder au jeu Pong
]