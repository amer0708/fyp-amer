from django.shortcuts import render
from payment.models import Payment
from django.contrib import messages

# Create your views here.
def confirm_payment(request):
    return render(request,"confirm_payment.html")

def confirm_payment_list(request):
    payment_id = request.GET.get('payment_id')
    if request.method == 'POST':
        payment_id = request.POST.get('payment_id')
        action = request.POST.get('action')
        payment = Payment.objects.filter(payment_id=payment_id).first()
        if payment and action in ['accept', 'reject']:
            payment.status = 'approved' if action == 'accept' else 'rejected'
            payment.save()
            # Update related order status
            if payment.quotation and payment.quotation.order:
                payment.quotation.order.status = 'payment status'
                payment.quotation.order.save()
            messages.success(request, f'Payment has been {"approved" if action == "accept" else "rejected"}.')
    payments = Payment.objects.all()
    if payment_id:
        payments = payments.filter(payment_id=payment_id)
    context = {
        'payments': payments,
        'payment_id': payment_id,
    }
    return render(request, 'confirm_payment.html', context)