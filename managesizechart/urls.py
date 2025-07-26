from django.urls import path
from . import views

urlpatterns = [
    path('managesizechart/', views.managesizechart, name='size_chart_editor'),
    path('editor/get_chart/<int:chart_id>/', views.get_chart, name='get_chart'),
    path('editor/set_active_charts/', views.set_active_charts, name='set_active_charts'),
]