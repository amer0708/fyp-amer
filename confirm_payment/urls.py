from django.urls import path, include
from . import views

urlpatterns =[
    path("confirm_payment", views.confirm_payment_list, name="confirm_payment"),
]