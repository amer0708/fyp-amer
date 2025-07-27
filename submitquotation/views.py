# views.py for submit_quotation app (Admin app)
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.contrib import messages
from django.db import transaction
from .models import Customer, Quotation, QuotationItem
import datetime
from decimal import Decimal
from django.views.decorators.csrf import csrf_exempt
from submit_order.models import Order
from django.urls import reverse

@csrf_exempt
def submit_quotation(request, order_id):
    customer = None
    order = None
    if order_id:
        order = get_object_or_404(Order, id=order_id)
        # Try to get the user as customer if set
        if order.customer:
            customer = order.customer

    # Default customer data if no customer selected
    if customer:
        default_customer = {
            'name': getattr(customer, 'full_name', getattr(customer, 'name', '')),
            'email': customer.email,
            'phone': getattr(customer, 'phone', '')
        }
    elif order:
        default_customer = {
            'name': order.full_name,
            'email': order.email,
            'phone': order.phone
        }
    else:
        default_customer = {
            'name': 'John Doe',
            'email': 'john@example.com',
            'phone': '+1 (555) 123-4567'
        }

    show_form = True
    # Prevent multiple submissions: check if a quotation already exists for this order
    if order:
        existing_quotation = order.quotations.first()
        if existing_quotation:
            show_form = False
            # Remove the messages.info call to avoid duplicate message

    if request.method == 'POST':
        print('POST data:', request.POST)
        try:
            with transaction.atomic():
                # Get or create customer
                customer_name = request.POST.get('customer_name')
                customer_email = request.POST.get('customer_email')
                customer_phone = request.POST.get('customer_phone')
                print('Customer:', customer_name, customer_email, customer_phone)
                print('Phone length:', len(customer_phone) if customer_phone else 0)
                print('Phone value:', repr(customer_phone))
                
                if not (customer_name and customer_email and customer_phone):
                    messages.error(request, "All customer fields are required.")
                    return render(request, 'submitquotation.html', {'customer': default_customer, 'current_date': datetime.date.today(), 'show_form': True})
                
                # Use User as customer if possible
                user_customer = None
                try:
                    from signup.models import User
                    user_customer = User.objects.get(email=customer_email)
                except Exception:
                    pass
                
                # Always set custom_customer
                print('Creating customer with phone:', repr(customer_phone))
                print('Phone length for database:', len(customer_phone) if customer_phone else 0)
                try:
                    custom_customer_obj, _ = Customer.objects.get_or_create(
                        email=customer_email,
                        defaults={'name': customer_name, 'phone': customer_phone}
                    )
                    print('Customer created successfully:', custom_customer_obj)
                except Exception as e:
                    print('Error creating customer:', e)
                    print('Error type:', type(e))
                    raise e
                
                # Create quotation
                print('Creating quotation with status: pending')
                try:
                    quotation = Quotation.objects.create(
                        customer=user_customer if user_customer else None,
                        custom_customer=custom_customer_obj,
                        order=order if order else None,
                        company_name=request.POST.get('company_name'),
                        date=request.POST.get('date'),
                        bank_name=request.POST.get('bank_name', 'RHB Bank'),
                        account_name=request.POST.get('account_name', 'Waniey Tailor'),
                        account_number=request.POST.get('account_number', '1234-5678-9012'),
                        status='pending'
                    )
                    print('Quotation created successfully:', quotation)
                except Exception as e:
                    print('Error creating quotation:', e)
                    print('Error type:', type(e))
                    raise e
                if order:
                    order.status = 'payment status'
                    order.save()
                print('Quotation object:', quotation)
                
                # Process items
                descriptions = request.POST.getlist('item_desc[]')
                quantities = request.POST.getlist('item_qty[]')
                prices = request.POST.getlist('item_price[]')
                print('Items:', list(zip(descriptions, quantities, prices)))
                
                for desc, qty, price in zip(descriptions, quantities, prices):
                    if desc.strip():  # Only process items with description
                        item = QuotationItem.objects.create(
                            quotation=quotation,
                            description=desc.strip(),
                            quantity=int(qty) if qty else 1,
                            unit_price=Decimal(str(price)) if price else Decimal('0.00')
                        )
                        print('Created item:', item)
                messages.success(request, f"Quotation {quotation.quotation_id} created successfully!")
                return redirect(reverse('submitquotation:quotation_success', args=[quotation.quotation_id]))
        except Exception as e:
            print('Exception:', e)
            messages.error(request, f"Error creating quotation: {str(e)}")

    context = {
        'customer': customer or default_customer,
        'order': order,
        'current_date': datetime.date.today(),
        'show_form': show_form,
    }
    return render(request, 'submitquotation.html', context)

def quotation_success(request, quotation_id):
    """Display success page with quotation details"""
    quotation = get_object_or_404(Quotation, quotation_id=quotation_id)
    # Prefer order info if available, then user, then custom_customer
    if quotation.order:
        name = quotation.order.full_name
        email = quotation.order.email
        phone = quotation.order.phone
    elif quotation.customer:
        name = getattr(quotation.customer, 'full_name', getattr(quotation.customer, 'name', ''))
        email = quotation.customer.email
        phone = getattr(quotation.customer, 'phone', '')
    elif quotation.custom_customer:
        name = quotation.custom_customer.name
        email = quotation.custom_customer.email
        phone = quotation.custom_customer.phone
    else:
        name = 'John Doe'
        email = 'john@example.com'
        phone = '+1 (555) 123-4567'
    context = {
        'quotation': quotation,
        'customer_name': name,
        'customer_email': email,
        'customer_phone': phone,
    }
    return render(request, 'quotation_success.html', context)

def generate_quotation(request):
    """Alternative endpoint for generating quotations"""
    return submit_quotation(request)

def get_customer_details(request, customer_id):
    """AJAX endpoint to get customer details"""
    try:
        customer = Customer.objects.get(id=customer_id)
        data = {
            'name': customer.name,
            'email': customer.email,
            'phone': customer.phone
        }
        return JsonResponse(data)
    except Customer.DoesNotExist:
        return JsonResponse({'error': 'Customer not found'}, status=404)