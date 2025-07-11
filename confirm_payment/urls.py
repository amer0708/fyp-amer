from django.urls import path, include
from . import views

urlpatterns =[
    path("confirm_payment",views.confirm_payment,name="confirm_payment"),
]