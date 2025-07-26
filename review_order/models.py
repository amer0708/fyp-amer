from django.db import models
from submit_order.models import Order

# Create your models here.

class OrderReview(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    reviewed_by = models.CharField(max_length=100, blank=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    admin_notes = models.TextField(blank=True)

    def __str__(self):
        return f"Review for Order #{self.order.id}"
