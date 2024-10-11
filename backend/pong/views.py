from django.shortcuts import render

# Create your views here.
from django.shortcuts import render

def pong_view(request):
    return render(request, 'pong/index.html')  # Rendre le template HTML pour le jeu Pong