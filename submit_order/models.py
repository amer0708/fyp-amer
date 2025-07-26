from django.db import models
from django.core.validators import MinValueValidator
from customize_clothes.models import Design
from signup.models import User

class Order(models.Model):
    ROLE_CHOICES = [
        ('hr', 'HR Manager'),
        ('admin', 'Administrator'),
        ('purchasing', 'Purchasing Department'),
        ('manager', 'Department Manager'),
        ('other', 'Other'),
    ]
    
    # Customer details
    full_name = models.CharField(max_length=100, null=True)
    company_name = models.CharField(max_length=100, null=True )
    email = models.EmailField(null=True)
    phone = models.CharField(max_length=20, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, null=True)
    other_role = models.CharField(max_length=100, blank=True, null=True)
    customer = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='orders')
    
    # Order options
    has_custom_sizes = models.BooleanField(default=False, null=True)
    delivery_date = models.DateField(null=True)
    
    # Design reference (if applicable)
    design = models.ForeignKey(Design, on_delete=models.SET_NULL, blank=True, null=True, related_name='orders')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.CharField(max_length=20, default='order submitted')
    
    order_number = models.PositiveIntegerField(unique=True, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            last = Order.objects.all().order_by('-order_number').first()
            self.order_number = (last.order_number + 1) if last and last.order_number else 1
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Order #{self.id} - {self.company_name}"


class StandardSizeQuantity(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    SIZE_CHOICES = [
        ('S', 'S'),
        ('M', 'M'),
        ('L', 'L'),
        ('XL', 'XL'),
        ('XXL', 'XXL'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='standard_sizes')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    size = models.CharField(max_length=3, choices=SIZE_CHOICES)
    quantity = models.PositiveIntegerField(validators=[MinValueValidator(0)])
    
    class Meta:
        unique_together = ('order', 'gender', 'size')
    
    def __str__(self):
        return f"{self.get_gender_display()} {self.size}: {self.quantity}"

class CustomSize(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='custom_sizes')
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    
    # Measurements in inches
    chest = models.DecimalField(max_digits=5, decimal_places=2)
    waist = models.DecimalField(max_digits=5, decimal_places=2)
    hip = models.DecimalField(max_digits=5, decimal_places=2)
    shoulder = models.DecimalField(max_digits=5, decimal_places=2)
    sleeve = models.DecimalField(max_digits=5, decimal_places=2)
    shirt_length = models.DecimalField(max_digits=5, decimal_places=2)
    neck = models.DecimalField(max_digits=5, decimal_places=2)
    
    def __str__(self):
        return f"Custom {self.get_gender_display()} Size for Order #{self.order.id}"