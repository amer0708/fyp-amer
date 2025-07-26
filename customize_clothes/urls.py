from django.urls import path
from . import views

app_name = 'customize_clothes'

urlpatterns = [
    path('', views.customize, name='customize'),
]