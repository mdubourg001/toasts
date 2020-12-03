from django.db import models
from django.contrib.auth.models import User

# --- Mixins --- #

class UpdateTrackedModelMixin:
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

# --- Models --- #

class City(models.Model):
    name = models.CharField(max_length=1024)
    latitude = models.IntegerField()
    longitude = models.IntegerField()

class Tournament(models.Model):
    name = models.CharField(max_length=1024)
    date = models.DateTimeField()
    location = models.ForeignKey(to=City, on_delete=models.PROTECT)
    cashprize = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

class Game(models.Model):
    date = models.DateTimeField()
    tournament = models.ForeignKey(to=Tournament, on_delete=models.SET_NULL, null=True, blank=True)
    white_pawns_player = models.ForeignKey(to=User, on_delete=models.PROTECT, related_name='played_as_white')
    black_pawns_player = models.ForeignKey(to=User, on_delete=models.PROTECT, related_name='played_as_black')
    is_finished = models.BooleanField(default=False)
    referees = models.ManyToManyField(to=User, blank=True)
    