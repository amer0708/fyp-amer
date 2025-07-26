from django.urls import path
from . import views
from .views import get_active_size_charts

app_name = 'submit_order'

urlpatterns = [
    path('submit_order/', views.submit_order, name='submit_order'),
    path('get_active_size_charts/', get_active_size_charts, name='get_active_size_charts'),
    path('order_confirmation/<int:order_id>/', views.order_confirmation, name='order_confirmation'),
]