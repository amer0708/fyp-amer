from django.urls import path
from . import views

app_name = 'submitquotation'

urlpatterns = [
    path('submitquotation/', views.submit_quotation, name='submit_quotation'),
    path('submitquotation/<int:customer_id>/', views.submit_quotation, name='submit_quotation_customer'),
    path('submitquotation/order/<int:order_id>/', views.submit_quotation, name='submit_quotation_order'),
    path('generate-quotation/', views.generate_quotation, name='generate_quotation'),
    path('quotation-success/<str:quotation_id>/', views.quotation_success, name='quotation_success'),
    path('api/customer/<int:customer_id>/', views.get_customer_details, name='get_customer_details'),
]