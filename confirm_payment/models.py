from django.db import models
from payment.models import Payment

# Create your models here.

class ConfirmedPayment(Payment):
    class Meta:
        proxy = True
        verbose_name = 'Confirmed Payment'
        verbose_name_plural = 'Confirmed Payments'
