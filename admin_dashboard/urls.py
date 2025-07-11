from django.urls import path, include
from . import views

urlpatterns =[
    path("admin_dashboard",views.admin_dashboard,name="admin_dashboard"),
]