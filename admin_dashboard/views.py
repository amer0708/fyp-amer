from django.shortcuts import render, redirect
from submit_order.models import Order
from review_order.models import OrderReview
from django.contrib.auth.decorators import login_required, user_passes_test
from django.contrib import messages

# Create your views here.
@login_required(login_url='login_admin')
@user_passes_test(lambda u: u.is_staff, login_url='login_admin')
def admin_dashboard(request):
    user = request.user
    
    # Check if user is authenticated and is staff
    if not user.is_authenticated:
        messages.error(request, "Please log in to access the admin dashboard.")
        return redirect('login_admin')
    
    if not user.is_staff:
        messages.error(request, "You don't have permission to access the admin dashboard.")
        return redirect('login_admin')
    
    search = request.GET.get('search', '').strip()
    orders = Order.objects.all().order_by('-order_number')
    if search:
        from django.db.models import Q
        orders = orders.filter(
            Q(full_name__icontains=search) |
            Q(email__icontains=search) |
            Q(phone__icontains=search) |
            Q(company_name__icontains=search)
        )
    # Attach review to each order
    for order in orders:
        try:
            order.review = OrderReview.objects.get(order=order)
        except OrderReview.DoesNotExist:
            order.review = None
    return render(request, "admin_dashboard.html", {"orders": orders, 'search': search})