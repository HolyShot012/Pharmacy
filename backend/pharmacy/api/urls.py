from django.urls import path, include
from .views import  register_user, login_user, logout_user
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [

    path('users/register', register_user, name='register'),
    path('users/login', login_user ,name='login'),
    path('api/users/logout', logout_user, name='logout'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),    
]