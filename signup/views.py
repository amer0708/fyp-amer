from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.contrib.auth.hashers import make_password
from .models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email

def signup(request):
    # Step 3.1: Handle POST request (form submission)
    if request.method == 'POST':
        # Step 3.2: Retrieve form inputs
        full_name = request.POST.get('full_name')
        email = request.POST.get('email')
        phone = request.POST.get('phone')
        password = request.POST.get('password1')
        confirm_password = request.POST.get('password2')
        
        errors = {}
        
        # Step 3.3: Validate inputs
        # Validate full name
        if not full_name or len(full_name.strip()) < 3:
            errors['full_name'] = 'Please enter a valid full name (min 3 characters)'
        
        # Validate email
        if not email:
            errors['email'] = 'Email is required'
        else:
            try:
                validate_email(email)
                if User.objects.filter(email=email).exists():
                    errors['email'] = 'This email is already registered'
            except ValidationError:
                errors['email'] = 'Please enter a valid email address'
        
        # Validate phone
        if not phone or not phone.isdigit() or len(phone) < 10:
            errors['phone'] = 'Please enter a valid phone number (digits only, min 10 characters)'
        
        # Validate password
        if not password or len(password) < 8:
            errors['password1'] = 'Password must be at least 8 characters'
        elif password != confirm_password:
            errors['password2'] = 'Passwords do not match'
        
        # Step 3.4: If no errors, create user
        if not errors:
            try:
                user = User.objects.create(
                    username=email,
                    email=email,
                    full_name=full_name,
                    phone=phone,
                    password=make_password(password)  # Hashes the password
                )
                # Log the user in
                login(request, user)
                # Redirect to success page
                return redirect('customer_dashboard')  # Change to your desired redirect
            except Exception as e:
                errors['general'] = f'Registration failed: {str(e)}'
        
        # Step 3.5: If errors exist, re-render form with errors
        return render(request, 'signup.html', {
            'errors': errors,
            'full_name': full_name,
            'email': email,
            'phone': phone,
        })
    
    # Step 3.6: Handle GET request (initial page load)
    return render(request, 'signup.html')