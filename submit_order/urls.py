from django.urls import path, include
from . import views

urlpatterns =[
    path("submitorder/",views.submit_order,name="submit_order"),
]