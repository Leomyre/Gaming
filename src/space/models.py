from django.db import models
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render

# Vue pour afficher la liste des jeux
def game_list(request):
    games = Game.objects.all()  # Récupère tous les jeux disponibles
    return render(request, 'game/game_list.html', {'games': games})

# Vue pour afficher un jeu spécifique
def game_detail(request, slug):
    game = get_object_or_404(Game, slug=slug)
    return render(request, f'game/{slug}.html', {'game': game})

class Game(models.Model):
    name = models.CharField(max_length=100)  # Nom du jeu
    description = models.TextField(blank=True)  # Description du jeu
    slug = models.SlugField(unique=True)  # Identifiant unique pour l'URL
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Score(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.IntegerField()
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.points}"
