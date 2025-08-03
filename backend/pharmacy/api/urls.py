from django.urls import path, include
from .views import  *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [

    path('users/register', register_user, name='register'),
    path('users/login', login_user ,name='login'),
    path('users/logout', logout_user, name='logout'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('users/profile', get_user, name='get_user')

]