from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializer import UserSerializer, OrderItemSerializer
from rest_framework import status
from .models import Users


@api_view(['GET'])
def user_list(request):
    users = Users.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


