from django.shortcuts import render, redirect
from django.contrib import messages
from django.utils import timezone
from django.urls import reverse
from submit_order.models import Order
from review_order.models import OrderReview

def update_status(request):
    # Define the ordered status steps
    status_steps = [
        'order submitted',
        'order review status',
        'receive price quotation',
        'submit deposit payment',
        'payment status',
        'in progress',
        'completed'
    ]
    order_id = request.GET.get('order_id')
    order_obj = None
    order = None
    review_rejected = False
    quotation_rejected = False
    review_approved = False
    if order_id:
        try:
            order_obj = Order.objects.get(id=order_id)
            # Check if review is approved
            try:
                review = OrderReview.objects.get(order=order_obj)
                if review.status == 'approved':
                    review_approved = True
                if review.status == 'rejected':
                    review_rejected = True
            except OrderReview.DoesNotExist:
                pass
            # Determine payment status for progress logic
            latest_payment = None
            payment_approved = False
            payment_rejected = False
            if hasattr(order_obj, 'quotations') and order_obj.quotations.exists():
                quotation = order_obj.quotations.first()
                if hasattr(quotation, 'payments') and quotation.payments.exists():
                    latest_payment = quotation.payments.order_by('-payment_date').first()
                    if latest_payment.status == 'approved':
                        payment_approved = True
                    elif latest_payment.status == 'rejected':
                        payment_rejected = True
            # Check if any quotation is rejected
            if hasattr(order_obj, 'quotations') and order_obj.quotations.exists():
                for q in order_obj.quotations.all():
                    if getattr(q, 'status', None) == 'rejected':
                        quotation_rejected = True
                        break
            # Custom status index logic
            status = order_obj.status
            status_index = status_steps.index(status) if status in status_steps else 0
            # If payment is approved, tick 'in progress' too
            if status == 'payment status' and payment_approved:
                status_index = status_steps.index('in progress')
            order = {
                'id': order_obj.id,
                'status': status,
                'status_history': [],  # TODO: fill with real history if available
                'available_options': ['completed'],
                'status_index': status_index,
                'payment_rejected': payment_rejected,
                'review_rejected': review_rejected,
                'review_approved': review_approved,
                'quotation_rejected': quotation_rejected,
            }
        except Order.DoesNotExist:
            order = None
    if not order:
        # fallback to default order for demo
        order = {
            'id': 1001,
            'status': 'in progress',
            'status_history': [
                {'date': '2023-05-15 10:30', 'status': 'order submitted'},
                {'date': '2023-05-15 11:00', 'status': 'order review status'},
                {'date': '2023-05-15 12:00', 'status': 'receive price quotation'},
                {'date': '2023-05-15 13:00', 'status': 'submit deposit payment'},
                {'date': '2023-05-15 14:00', 'status': 'payment status'},
                {'date': '2023-05-16 09:00', 'status': 'in progress'}
            ],
            'available_options': ['completed']
        }
    updated = request.GET.get('updated') == 'true'
    if updated:
        order['status'] = 'completed'
    try:
        status_index = status_steps.index(order['status'].lower())
    except ValueError:
        status_index = 0
    order['status_index'] = status_index
    payment_status_index = status_steps.index('payment status')
    return render(request, 'update_status.html', {
        'customer': {
            'name': 'John Doe',
            'email': 'john@example.com', 
            'phone': '+1 (555) 123-4567'
        },
        'order': order,
        'updated': updated,
        'current_date': timezone.now(),
        'status_steps': status_steps,
        'payment_status_index': payment_status_index,
        'review_rejected': review_rejected,
        'quotation_rejected': quotation_rejected,
        'review_approved': review_approved,
    })

def update_order_status(request, order_id):
    if request.method == 'POST':
        new_status = request.POST.get('new_status')
        try:
            order = Order.objects.get(id=order_id)
            order.status = new_status
            order.save()
            messages.success(request, f'Status updated to {new_status}')
            return redirect(f"{reverse('update_status')}?order_id={order_id}")
        except Order.DoesNotExist:
            messages.error(request, 'Order not found.')
            return redirect('update_status')
    return redirect('update_status')