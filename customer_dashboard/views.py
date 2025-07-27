from django.shortcuts import render, redirect
from submit_order.models import Order
from django.db.models import Prefetch
from submitquotation.models import Quotation
from payment.models import Payment
from review_order.models import OrderReview
from django.contrib.auth.decorators import login_required
from django.contrib import messages

# Create your views here.
@login_required(login_url='login_customer')
def customer_dashboard(request):
    user = request.user
    
    # Check if user is authenticated and has email
    if not user.is_authenticated:
        messages.error(request, "Please log in to access your dashboard.")
        return redirect('login_customer')
    
    if not hasattr(user, 'email') or not user.email:
        messages.error(request, "User profile is incomplete. Please contact support.")
        return redirect('login_customer')
    
    # Query orders for this user by email, prefetch quotations
    orders = Order.objects.filter(email=user.email).prefetch_related(
        Prefetch('quotations', queryset=Quotation.objects.all())
    ).order_by('-order_number')
    
    # Annotate each quotation with payment_rejected
    for order in orders:
        in_progress = False
        review_rejected = False
        review_approved = False
        pending_payment = False
        try:
            review = OrderReview.objects.get(order=order)
            if review.status == 'rejected':
                review_rejected = True
            if review.status == 'approved':
                review_approved = True
        except OrderReview.DoesNotExist:
            pass
        for quotation in order.quotations.all():
            quotation.payment_rejected = Payment.objects.filter(quotation=quotation, status='rejected').exists()
            quotation.quotation_rejected = (quotation.status == 'rejected')
            if Payment.objects.filter(quotation=quotation, status='approved').exists():
                in_progress = True
            if Payment.objects.filter(quotation=quotation, status='pending').exists():
                pending_payment = True
        latest_quotation = order.quotations.order_by('-date').first() if hasattr(order, 'quotations') else None
        # Check if any payment is rejected
        payment_rejected = False
        for quotation in order.quotations.all():
            if Payment.objects.filter(quotation=quotation, status='rejected').exists():
                payment_rejected = True
                break
        
        if review_rejected:
            order.display_status = 'Order Rejected'
        elif latest_quotation and getattr(latest_quotation, 'status', None) == 'rejected':
            order.display_status = 'Quotation Rejected'
        elif payment_rejected:
            order.display_status = 'Payment Rejected'
        elif order.status == 'completed':
            order.display_status = 'Completed - Ready to pickup'
        elif in_progress and order.status in ['payment status', 'in progress']:
            order.display_status = 'in progress'
        elif pending_payment:
            order.display_status = 'Payment Submitted'
        elif latest_quotation and getattr(latest_quotation, 'status', None) == 'receive price quotation':
            order.display_status = 'Receive Price Quotation'
        elif review_approved:
            order.display_status = 'Order Accepted'
        else:
            order.display_status = order.status
    
    context = {
        'orders': orders,
        'full_name': getattr(user, 'full_name', ''),
        'email': user.email,
        'phone': getattr(user, 'phone', ''),
    }
    return render(request, 'customer_dashboard.html', context)