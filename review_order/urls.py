from django.urls import path, include
from . import views

urlpatterns =[
    path("review_order",views.review_order,name="review_order"),
]