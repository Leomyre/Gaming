from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_view, name='space'),    
    path('save_score/', views.save_score, name='save_score'),
    path('<slug:slug>/', views.game_detail, name='game_detail'),  # Jeu spécifique
]
