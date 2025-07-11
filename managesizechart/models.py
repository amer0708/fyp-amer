# Create your models here.
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
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['-created_at']