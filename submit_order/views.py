from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Order, StandardSizeQuantity, CustomSize
from customize_clothes.models import Design
import json
from datetime import datetime


def submit_order(request):
    design = None
    svg_content = None
    if 'design_id' in request.session:
        try:
            design = Design.objects.get(id=request.session['design_id'])
            if design.svg_file:
                with open(design.svg_file.path, 'r', encoding='utf-8') as f:
                    svg_content = f.read()
        except Design.DoesNotExist:
            design = None
    user_info = {}
    if request.user.is_authenticated:
        user_info = {
            'full_name': getattr(request.user, 'full_name', ''),
            'email': getattr(request.user, 'email', ''),
            'phone': getattr(request.user, 'phone', ''),
        }
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            order = Order.objects.create(
                full_name=data['customer_details']['fullName'],
                company_name=data['customer_details']['companyName'],
                email=data['customer_details']['email'],
                phone=data['customer_details']['phone'],
                role=data['customer_details']['role'],
                other_role=data['customer_details'].get('otherRole'),
                has_custom_sizes=data['order_options']['hasCustomSizes'],
                delivery_date=datetime.strptime(data['order_options']['deliveryDate'], '%Y-%m-%d').date(),
                design=design,
                status='order submitted'
            )
            for gender, sizes in data['standard_sizes'].items():
                for size, quantity in sizes.items():
                    if quantity > 0:
                        print(f"Creating StandardSizeQuantity: gender={gender}, size='{size}' (length={len(size)}), quantity={quantity}")
                        try:
                            StandardSizeQuantity.objects.create(
                                order=order,
                                gender=gender,
                                size=size,
                                quantity=quantity
                            )
                        except Exception as e:
                            print(f"Error creating StandardSizeQuantity: {e}")
                            raise e
            if data['order_options']['hasCustomSizes'] and 'custom_sizes' in data:
                for i, custom_size in enumerate(data['custom_sizes']):
                    print(f"Creating CustomSize {i+1}:")
                    print(f"  gender='{custom_size['gender']}' (length={len(custom_size['gender'])})")
                    print(f"  chest={custom_size['chest']} (type={type(custom_size['chest'])})")
                    print(f"  waist={custom_size['waist']} (type={type(custom_size['waist'])})")
                    print(f"  hip={custom_size['hip']} (type={type(custom_size['hip'])})")
                    print(f"  shoulder={custom_size['shoulder']} (type={type(custom_size['shoulder'])})")
                    print(f"  sleeve={custom_size['sleeve']} (type={type(custom_size['sleeve'])})")
                    print(f"  shirt_length={custom_size['shirtLength']} (type={type(custom_size['shirtLength'])})")
                    print(f"  neck={custom_size['neck']} (type={type(custom_size['neck'])})")
                    
                    try:
                        # Try creating each field individually to identify the problem
                        print("Attempting to create CustomSize...")
                        
                        # Test each field individually
                        test_obj = CustomSize()
                        test_obj.order = order
                        print("✓ Order assigned")
                        
                        test_obj.gender = custom_size['gender']
                        print(f"✓ Gender assigned: '{test_obj.gender}'")
                        
                        test_obj.chest = custom_size['chest']
                        print(f"✓ Chest assigned: {test_obj.chest}")
                        
                        test_obj.waist = custom_size['waist']
                        print(f"✓ Waist assigned: {test_obj.waist}")
                        
                        test_obj.hip = custom_size['hip']
                        print(f"✓ Hip assigned: {test_obj.hip}")
                        
                        test_obj.shoulder = custom_size['shoulder']
                        print(f"✓ Shoulder assigned: {test_obj.shoulder}")
                        
                        test_obj.sleeve = custom_size['sleeve']
                        print(f"✓ Sleeve assigned: {test_obj.sleeve}")
                        
                        test_obj.shirt_length = custom_size['shirtLength']
                        print(f"✓ Shirt length assigned: {test_obj.shirt_length}")
                        
                        test_obj.neck = custom_size['neck']
                        print(f"✓ Neck assigned: {test_obj.neck}")
                        
                        # Now try to save
                        test_obj.save()
                        print(f"✓ Successfully saved CustomSize with ID: {test_obj.id}")
                        
                    except Exception as e:
                        print(f"Error creating CustomSize: {e}")
                        print(f"Error type: {type(e)}")
                        print(f"Error details: {str(e)}")
                        raise e
            return JsonResponse({
                'status': 'success',
                'order_id': order.id
            })
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': str(e)
            }, status=400)
    return render(request, 'submit_order.html', {'design': design, 'svg_content': svg_content, 'user_info': user_info})

def order_confirmation(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'submit_order/order_confirmation.html', {'order': order})

def get_active_size_charts(request):
    from managesizechart.models import SizeChart
    charts = SizeChart.objects.filter(is_active=True)
    data = {'male': {}, 'female': {}, 'unisex': {}}
    for chart in charts:
        data[chart.gender][chart.size_type] = {
            'name': chart.name,
            'measurements': chart.measurements,
        }
    return JsonResponse(data)