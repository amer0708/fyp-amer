from django.urls import path
from . import views

app_name = 'payment'

urlpatterns =[
    path('payment', views.payment, name='payment'),
    path('payment/<str:payment_id>/', views.payment_by_id, name='payment_by_id'),
    path('payment/approve/<int:payment_id>/', views.approve_payment, name='approve_payment'),
    path('payment/reject/<int:payment_id>/', views.reject_payment, name='reject_payment'),
    path('payment/confirmation/<int:payment_id>/', views.payment_confirmation, name='payment_confirmation'),
]