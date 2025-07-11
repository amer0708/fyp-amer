from django.urls import path, include
from . import views

urlpatterns =[
    path("customize_clothes/",views.customize_clothes,name="customize_clothes"),
]