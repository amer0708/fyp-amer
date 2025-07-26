from django.contrib import admin
from .models import Customer, Quotation, QuotationItem

admin.site.register(Customer)
admin.site.register(Quotation)
admin.site.register(QuotationItem)
