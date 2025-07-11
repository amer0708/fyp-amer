from django.urls import path, include
from . import views

urlpatterns =[
    path("status",views.status,name="status")
]