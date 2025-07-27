from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.utils import timezone
from .models import Payment
from submitquotation.models import Quotation
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponseForbidden
import os

def payment(request):
    # Get quotation_id from GET or POST
    quotation_id = request.GET.get('quotation_id') or request.POST.get('quotation_id')
    quotation = None
    deposit_amount = None
    if quotation_id:
        quotation = get_object_or_404(Quotation, quotation_id=quotation_id)
        deposit_amount = quotation.deposit_amount
    payment_exists = False
    if quotation:
        payment_exists = Payment.objects.filter(quotation=quotation).exists()
    customer_name = None
    company_name = None
    if quotation:
        # Try to get customer name from quotation
        if hasattr(quotation, 'customer') and quotation.customer:
            customer_name = getattr(quotation.customer, 'full_name', getattr(quotation.customer, 'name', ''))
        elif hasattr(quotation, 'custom_customer') and quotation.custom_customer:
            customer_name = quotation.custom_customer.name
        else:
            customer_name = 'Customer'
        company_name = quotation.company_name or 'Company'
    context = {
        'deposit_amount': deposit_amount,
        'quotation_id': quotation_id,
        'now': timezone.now(),
        'payment_exists': payment_exists,
        'customer_name': customer_name,
        'company_name': company_name,
    }
    if request.method == 'POST':
        if not quotation:
            messages.error(request, 'Quotation not found.')
            return render(request, 'payment.html', context)
        if payment_exists:
            messages.info(request, 'You have already submitted a payment for this quotation.')
            return render(request, 'payment.html', context)
        payment_proof = request.FILES.get('payment_proof')
        notes = request.POST.get('notes', '')
        payment_date_str = request.POST.get('payment_date')
        if not payment_proof:
            messages.error(request, 'Please upload a payment proof file.')
            return render(request, 'payment.html', context)
        # Validate file type and size
        ext = os.path.splitext(payment_proof.name)[1].lower()
        if ext not in ['.jpg', '.jpeg', '.png', '.pdf']:
            messages.error(request, 'Invalid file type. Only JPG, PNG, PDF allowed.')
            return render(request, 'payment.html', context)
        if payment_proof.size > 5 * 1024 * 1024:
            messages.error(request, 'File too large. Max 5MB allowed.')
            return render(request, 'payment.html', context)
        # Validate payment_date
        from datetime import datetime
        try:
            payment_date = datetime.strptime(payment_date_str, '%Y-%m-%d').date()
        except (ValueError, TypeError):
            messages.error(request, 'Invalid payment date.')
            return render(request, 'payment.html', context)
        if payment_date > timezone.localdate():
            messages.error(request, 'Payment date cannot be in the future.')
            return render(request, 'payment.html', context)
        # Save payment
        payment = Payment.objects.create(
            quotation=quotation,
            payment_proof=payment_proof,
            notes=notes,
            payment_date=payment_date,
        )
        # Update order status
        if quotation and quotation.order:
            quotation.order.status = 'payment status'
            quotation.order.save()
        messages.success(request, 'Payment proof submitted successfully!')
        return redirect('payment:payment_confirmation', payment_id=payment.id)
    else:
        if payment_exists:
            messages.info(request, 'You have already submitted a payment for this quotation.')
    return render(request, 'payment.html', context)

from django.contrib.admin.views.decorators import staff_member_required

def approve_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)
    if request.method == 'POST':
        payment.status = 'approved'
        payment.admin_remark = request.POST.get('admin_remark', '')
        payment.admin_action_date = timezone.now()
        payment.save()
        messages.success(request, 'Payment approved.')
        return redirect('admin:payment_payment_changelist')
    return render(request, 'admin/approve_payment.html', {'payment': payment})

def reject_payment(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)
    if request.method == 'POST':
        payment.status = 'rejected'
        payment.admin_remark = request.POST.get('admin_remark', '')
        payment.admin_action_date = timezone.now()
        payment.save()
        messages.success(request, 'Payment rejected.')
        return redirect('admin:payment_payment_changelist')
    return render(request, 'admin/reject_payment.html', {'payment': payment})

def payment_by_id(request, payment_id):
    payment = get_object_or_404(Payment, payment_id=payment_id)
    quotation = payment.quotation
    deposit_amount = quotation.deposit_amount if quotation else None
    context = {
        'deposit_amount': deposit_amount,
        'quotation_id': quotation.quotation_id if quotation else None,
        'now': timezone.now(),
        'payment_exists': True,
        'payment_id': payment_id,
    }
    return render(request, 'payment.html', context)

def payment_confirmation(request, payment_id):
    payment = get_object_or_404(Payment, id=payment_id)
    quotation = payment.quotation
    
    # Get customer and company information
    customer_name = None
    company_name = None
    if quotation:
        if hasattr(quotation, 'customer') and quotation.customer:
            customer_name = getattr(quotation.customer, 'full_name', getattr(quotation.customer, 'name', ''))
        elif hasattr(quotation, 'custom_customer') and quotation.custom_customer:
            customer_name = quotation.custom_customer.name
        else:
            customer_name = 'Customer'
        company_name = quotation.company_name or 'Company'
    
    # Get order number
    order_number = None
    if quotation and quotation.order:
        order_number = quotation.order.order_number
    
    context = {
        'payment': payment,
        'quotation': quotation,
        'deposit_amount': quotation.deposit_amount if quotation else None,
        'order_number': order_number,
        'payment_date': payment.payment_date.strftime('%Y-%m-%d') if payment.payment_date else None,
        'submission_time': payment.created_at.strftime('%Y-%m-%d %H:%M') if payment.created_at else None,
        'customer_name': customer_name,
        'company_name': company_name,
    }
    return render(request, 'payment_confirmation.html', context)