from django.contrib import admin
from .models import Order, StandardSizeQuantity, CustomSize

admin.site.register(Order)
admin.site.register(StandardSizeQuantity)
admin.site.register(CustomSize)
