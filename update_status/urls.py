from django.urls import path
from . import views

urlpatterns = [
    path('update_status/', views.update_status, name='update_status'),
    path('update_status/<int:order_id>/', views.update_order_status, name='update_order_status'),
]