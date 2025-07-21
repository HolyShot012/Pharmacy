from django.urls import path
from .views import get_medicines, add_medicine

urlpatterns = [
    path('medicines/', get_medicines, name='get_medicines'),
    path('medicines/add/', add_medicine, name='add_medicine'),
]