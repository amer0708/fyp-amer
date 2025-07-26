from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.admin.views.decorators import staff_member_required
from django.views.decorators.csrf import csrf_protect
from django.contrib import messages
from .models import OrderReview
from submit_order.models import Order
from django.utils import timezone

@staff_member_required
def order_list(request):
    orders = Order.objects.all().order_by('-created_at')
    return render(request, 'review_order.html', {'orders': orders})

@staff_member_required
@csrf_protect
def review_order(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    review, created = OrderReview.objects.get_or_create(order=order)
    if request.method == 'POST':
        action = request.POST.get('action')
        admin_notes = request.POST.get('admin_notes', '')
        if action == 'approve':
            review.status = 'approved'
            order.status = 'order review status'
            order.save()
            messages.success(request, "Order approved.")
        elif action == 'reject':
            review.status = 'rejected'
            order.status = 'order review status'
            order.save()
            messages.info(request, "Order rejected.")
        review.reviewed_by = request.user.username
        review.reviewed_at = timezone.now()
        review.admin_notes = admin_notes
        review.save()
        print(f"DEBUG: OrderReview for order {order.id} now has status: {review.status}")
        return redirect('review_order:order_list')
    return render(request, 'review_order.html', {'order': order, 'review': review})