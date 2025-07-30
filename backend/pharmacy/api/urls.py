from django.urls import path, include
from .views import user_list, create_user
urlpatterns = [
    path('users/', user_list, name ='user-list'),
    path('users/create/', create_user, name='create-user'),
]