# views.py for receive_quotation app (Customer app)
from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
import json

# Import models from the submitquotation app
from submitquotation.models import Quotation, Customer
from payment.models import Payment

def receive_quotation(request, quotation_id=None):
    """
    Display quotation for customer.
    Can be accessed by:
    1. quotation_id in URL parameter
    2. quotation_id in GET parameters  
    3. Latest quotation for customer by email
    """
    quotation = None
    
    # Method 1: Get quotation by ID from URL
    if quotation_id:
        try:
            quotation = Quotation.objects.get(quotation_id=quotation_id)
        except Quotation.DoesNotExist:
            messages.error(request, f"Quotation {quotation_id} not found")
            return render(request, "receive_quotation.html", {})
    
    # Method 2: Get quotation by ID from GET parameters
    elif request.GET.get('quotation_id'):
        quotation_id = request.GET.get('quotation_id')
        try:
            quotation = Quotation.objects.get(quotation_id=quotation_id)
        except Quotation.DoesNotExist:
            messages.error(request, f"Quotation {quotation_id} not found")
            return render(request, "receive_quotation.html", {})
    
    # Method 3: Get latest quotation by customer email
    elif request.GET.get('email'):
        customer_email = request.GET.get('email')
        try:
            customer = Customer.objects.get(email=customer_email)
            quotation = Quotation.objects.filter(customer=customer).order_by('-created_at').first()
            if not quotation:
                messages.warning(request, "No quotations found for this email")
                return render(request, "receive_quotation.html", {})
        except Customer.DoesNotExist:
            messages.error(request, "No customer found with this email")
            return render(request, "receive_quotation.html", {})
    
    # If no quotation found by any method
    if not quotation:
        messages.warning(request, "Please provide quotation ID or customer email to view quotation")
        return render(request, "receive_quotation.html", {})

    # Robust customer info logic
    if hasattr(quotation, 'order') and quotation.order:
        name = quotation.order.full_name
        email = quotation.order.email
        phone = quotation.order.phone
    elif hasattr(quotation, 'customer') and quotation.customer:
        name = getattr(quotation.customer, 'full_name', getattr(quotation.customer, 'name', ''))
        email = quotation.customer.email
        phone = getattr(quotation.customer, 'phone', '')
    elif hasattr(quotation, 'custom_customer') and quotation.custom_customer:
        name = quotation.custom_customer.name
        email = quotation.custom_customer.email
        phone = quotation.custom_customer.phone
    else:
        name = 'John Doe'
        email = 'john@example.com'
        phone = '+1 (555) 123-4567'

    payment_rejected = Payment.objects.filter(quotation=quotation, status='rejected').exists()
    context = {
        'quotation': quotation,
        'customer_name': name,
        'customer_email': email,
        'customer_phone': phone,
        'payment_exists': Payment.objects.filter(quotation=quotation).exists(),
        'payment_rejected': payment_rejected,
    }
    return render(request, "receive_quotation.html", context)

@csrf_exempt
def get_quotation_by_email(request):
    """
    AJAX endpoint to get quotation by customer email
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get('email')
            
            if not email:
                return JsonResponse({'error': 'Email is required'}, status=400)
            
            try:
                customer = Customer.objects.get(email=email)
                # Get latest quotation for this customer
                quotation = Quotation.objects.filter(customer=customer).order_by('-created_at').first()
                
                if not quotation:
                    return JsonResponse({'error': 'No quotation found for this email'}, status=404)
                
                # Return quotation data
                quotation_data = {
                    'quotation_id': quotation.quotation_id,
                    'customer_name': quotation.customer.name,
                    'company_name': quotation.company_name,
                    'date': quotation.date.strftime('%Y-%m-%d'),
                    'items': [
                        {
                            'description': item.description,
                            'quantity': item.quantity,
                            'price': float(item.unit_price),
                            'total': float(item.total_price)
                        }
                        for item in quotation.items.all()
                    ],
                    'subtotal': float(quotation.subtotal),
                    'deposit': float(quotation.deposit_amount),
                    'balance': float(quotation.balance_amount),
                    'bank_name': quotation.bank_name,
                    'account_name': quotation.account_name,
                    'account_number': quotation.account_number,
                    'status': quotation.status
                }
                
                return JsonResponse({'success': True, 'quotation': quotation_data})
                
            except Customer.DoesNotExist:
                return JsonResponse({'error': 'No customer found with this email'}, status=404)
                
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
def update_quotation_status(request):
    """
    Update quotation status (accept/reject)
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            quotation_id = data.get('quotation_id')
            status = data.get('status')  # 'accepted' or 'rejected'
            
            if not quotation_id or not status:
                return JsonResponse({'error': 'Quotation ID and status are required'}, status=400)
            
            if status not in ['accepted', 'rejected']:
                return JsonResponse({'error': 'Status must be "accepted" or "rejected"'}, status=400)
            
            try:
                quotation = Quotation.objects.get(quotation_id=quotation_id)
                quotation.status = status
                quotation.save()
                
                return JsonResponse({
                    'success': True,
                    'message': f'Quotation {status} successfully',
                    'quotation_id': quotation_id,
                    'status': status
                })
            except Quotation.DoesNotExist:
                return JsonResponse({'error': 'Quotation not found'}, status=404)
            
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

def customer_dashboard(request):
    """
    Customer dashboard to view all their quotations
    """
    customer_email = request.GET.get('email')
    quotations = []
    customer = None
    
    if customer_email:
        try:
            customer = Customer.objects.get(email=customer_email)
            quotations = Quotation.objects.filter(customer=customer).order_by('-created_at')
        except Customer.DoesNotExist:
            messages.warning(request, "No customer found with this email")
    
    context = {
        'quotations': quotations,
        'customer': customer,
        'customer_email': customer_email
    }
    return render(request, 'customer_dashboard.html', context)

def reject_quotation(request):
    if request.method == 'POST':
        quotation_id = request.POST.get('quotation_id')
        if quotation_id:
            try:
                quotation = Quotation.objects.get(quotation_id=quotation_id)
                quotation.status = 'rejected'
                quotation.save()
                messages.success(request, 'Quotation has been rejected.')
                return redirect(f'/receivequotation/?quotation_id={quotation_id}')
            except Quotation.DoesNotExist:
                messages.error(request, 'Quotation not found.')
    return redirect('/receivequotation/')