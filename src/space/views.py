from django.shortcuts import render

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Game, Score
import json

def game_view(request):
    return render(request, 'game/space/index.html')

@csrf_exempt
def save_score(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user = request.user
        points = data.get('points', 0)
        Score.objects.create(user=user, points=points)
        return JsonResponse({'message': 'Score saved!'})
    return JsonResponse({'error': 'Invalid request'}, status=400)



Game.objects.create(name="Spaceship", description="Un jeu où vous esquivez des obstacles.", slug="spaceship")
Game.objects.create(name="Maze Runner", description="Trouvez la sortie dans un labyrinthe.", slug="maze-runner")