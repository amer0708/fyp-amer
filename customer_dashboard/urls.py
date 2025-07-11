from django.urls import path, include
from . import views

urlpatterns =[
    path("customer_dashboard",views.customer_dashboard,name="customer_dashboard"),
]