from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.core.exceptions import ValidationError

def login_customer(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.is_active and not user.is_staff:  # Ensure it's a regular customer
                login(request, user)
                return redirect('customer_dashboard')  # Replace with your customer dashboard URL name
            else:
                messages.error(request, "This account doesn't have customer privileges.")
        else:
            messages.error(request, "Invalid email or password.")
    
    # If GET request or failed login, render the login page
    return render(request, "login_cust.html")

def login_admin(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        password = request.POST.get('password')
        
        user = authenticate(request, username=email, password=password)
        
        if user is not None:
            if user.is_active and user.is_staff:  # Ensure it's an admin
                login(request, user)
                return redirect('admin_dashboard')  # Replace with your admin dashboard URL name
            else:
                messages.error(request, "This account doesn't have admin privileges.")
        else:
            messages.error(request, "Invalid email or password.")
    
    # If GET request or failed login, render the login page
    return render(request, "login_admin.html")

def logout_admin(request):
    logout(request)
    messages.success(request, "You have been successfully logged out.")
    return redirect('login_admin')

def logout_customer(request):
    logout(request)
    messages.success(request, "You have been successfully logged out.")
    return redirect('login_customer')