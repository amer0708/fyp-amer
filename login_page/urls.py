from django.urls import path, include
from . import views

urlpatterns = [
    path("login_customer", views.login_customer, name="login_customer"),
    path("login_admin", views.login_admin, name="login_admin"),
    path("logout_admin", views.logout_admin, name="logout_admin"),
    path("logout_customer", views.logout_customer, name="logout_customer")
]