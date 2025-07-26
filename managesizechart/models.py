from django.db import models
import json

class SizeChart(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('unisex', 'Unisex'),
    ]
    
    SIZE_TYPE_CHOICES = [
        ('standard', 'Standard (S, M, L, XL, XXL)'),
        ('numeric', 'Numeric (28, 30, 32, etc.)'),
    ]
    
    name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    size_type = models.CharField(max_length=10, choices=SIZE_TYPE_CHOICES)
    measurements = models.JSONField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_gender_display()})"

    def get_measurements_display(self):
        """Format measurements for display"""
        try:
            return json.dumps(self.measurements, indent=2)
        except:
            return "Invalid measurements data"
    
    class Meta:
        ordering = ['-is_active', 'gender', 'size_type', 'name']