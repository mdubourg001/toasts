from rest_framework import serializers, views, viewsets
from django.contrib.auth.models import User
from django.db.models import Avg
from rest_framework.response import Response
from core.models import Game, Tournament

# --- User --- #

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ['url', 'username', 'email', 'is_staff']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# --- Game --- #

class GameSerializer(serializers.HyperlinkedModelSerializer):
    black_pawns_player = UserSerializer()
    white_pawns_player = UserSerializer()
    referees = UserSerializer(many=True)

    class Meta:
        model = Game
        fields = ['date', 'tournament', 'white_pawns_player', 'black_pawns_player', 'is_finished', 'referees']

class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all()
    serializer_class = GameSerializer


# --- Custom --- #

class CashprizeAvgAPIView(views.APIView):

    def get(self, request):
        cashprizes = Tournament.objects.all().aggregate(Avg('cashprize'))
        return Response(cashprizes)