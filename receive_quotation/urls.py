from django.urls import path, include
from . import views

urlpatterns =[
    path("receivequotation",views.receive_quotation,name="receive_quotation")
]