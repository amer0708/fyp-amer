from django.urls import path, include
from . import views

urlpatterns =[
    path("login/customer",views.login_customer,name="login_customer"),
    path("login/admin",views.login_admin,name="login_admin")
]