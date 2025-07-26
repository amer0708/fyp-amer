from django.urls import path
from . import views

app_name = 'receive_quotation'

urlpatterns = [
    # Main quotation view - supports multiple access methods
    path('receivequotation/', views.receive_quotation, name='receive_quotation'),
    path('quotation/<str:quotation_id>/', views.receive_quotation, name='receive_quotation_id'),
    
    # Customer dashboard
    path('customer-dashboard/', views.customer_dashboard, name='customer_dashboard'),
    
    # API endpoints
    path('api/quotation-by-email/', views.get_quotation_by_email, name='quotation_by_email'),
    path('api/update-quotation-status/', views.update_quotation_status, name='update_quotation_status'),
    path('receivequotation/reject/', views.reject_quotation, name='reject_quotation'),
]