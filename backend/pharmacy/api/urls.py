from django.urls import path
from .views import  *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [

    path('users/register', register_user, name='register'),
    path('users/login', login_user ,name='login'),
    path('users/logout', logout_user, name='logout'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('token', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('users/profile', get_user, name='get_user'),
    path('users/create_order', create_order, name='create_order'),
    path('branches', get_branches, name='get_branches'),
    path('products', get_products, name='get_products'),
    

]