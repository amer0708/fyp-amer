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
                        StandardSizeQuantity.objects.create(
                            order=order,
                            gender=gender,
                            size=size,
                            quantity=quantity
                        )
            if data['order_options']['hasCustomSizes'] and 'custom_sizes' in data:
                for custom_size in data['custom_sizes']:
                    CustomSize.objects.create(
                        order=order,
                        gender=custom_size['gender'],
                        chest=custom_size['chest'],
                        waist=custom_size['waist'],
                        hip=custom_size['hip'],
                        shoulder=custom_size['shoulder'],
                        sleeve=custom_size['sleeve'],
                        shirt_length=custom_size['shirtLength'],
                        neck=custom_size['neck']
                    )
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