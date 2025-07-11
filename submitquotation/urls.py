from django.urls import path, include
from . import views

urlpatterns =[
    path("submitquotation/",views.submitquotation,name="submitquotation"),
]