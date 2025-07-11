from django.urls import path, include
from . import views

urlpatterns =[
    path("update_status",views.update_status,name="update_status"),
]