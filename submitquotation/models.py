# models.py for submit_quotation app (Admin app)
from django.db import models
from django.utils import timezone
import uuid
from decimal import Decimal
from signup.models import User
from submit_order.models import Order

class Customer(models.Model):
    name = models.CharField(max_length=255)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class Quotation(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('expired', 'Expired'),
    ]
    
    quotation_id = models.CharField(max_length=50, blank=True, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    custom_customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name='quotations')
    company_name = models.CharField(max_length=255)
    date = models.DateField(default=timezone.now)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    deposit_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=70.00)
    deposit_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    balance_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Bank details
    bank_name = models.CharField(max_length=255, default='RHB Bank')
    account_name = models.CharField(max_length=255, default='Waniey Tailor')
    account_number = models.CharField(max_length=50, default='1234-5678-9012')
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name='quotations')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.quotation_id:
            self.quotation_id = f"Q-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        # Convert deposit_percentage to Decimal for calculation
        deposit_percentage = Decimal(str(self.deposit_percentage))
        self.deposit_amount = (self.subtotal * deposit_percentage) / Decimal('100')
        self.balance_amount = self.subtotal - self.deposit_amount
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.quotation_id} - {getattr(self.customer, 'full_name', str(self.customer))}"

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='items')
    description = models.CharField(max_length=255)
    quantity = models.IntegerField(default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True)
    
    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
        
        # Update quotation subtotal
        self.quotation.subtotal = sum(item.total_price for item in self.quotation.items.all())
        self.quotation.save()
    
    def __str__(self):
        return f"{self.description} x {self.quantity}"