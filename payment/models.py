from django.db import models
from submitquotation.models import Quotation
from django.utils import timezone
import uuid

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]
    payment_id = models.CharField(max_length=50, unique=True, blank=True, null=True)
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='payments')
    payment_proof = models.FileField(upload_to='payment_proofs/', blank=False, null=False)
    notes = models.TextField(blank=True, null=True)
    payment_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    admin_remark = models.TextField(blank=True, null=True)
    admin_action_date = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True)

    def save(self, *args, **kwargs):
        if not self.payment_id:
            self.payment_id = f"PAY-{timezone.now().year}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Payment {self.payment_id} for {self.quotation.quotation_id} - {self.get_status_display()}"