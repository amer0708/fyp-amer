from django.urls import path
from . import views

app_name = 'review_order'

urlpatterns = [
    path('', views.order_list, name='order_list'),
    path('orders/', views.order_list, name='order_list'),
    path('orders/<int:order_id>/review/', views.review_order, name='review_order'),
    path('review_orders/', views.order_list, name='order_list_plural'),  # Now /review_orders/ works
]