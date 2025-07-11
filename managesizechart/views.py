from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import SizeChart
import json

def managesizechart(request):
    if request.method == 'POST':
        # Handle form submission
        name = request.POST.get('chartName')
        gender = request.POST.get('gender')
        size_type = request.POST.get('sizeType')
        chart_id = request.POST.get('chartId')  # For editing existing charts
        
        # Process measurements
        measurements = {}
        for key, value in request.POST.items():
            if key.startswith('size_'):
                parts = key.split('_')
                if len(parts) >= 3:
                    size = parts[1]
                    measurement = parts[2]
                    
                    if size not in measurements:
                        measurements[size] = {}
                    
                    try:
                        measurements[size][measurement] = float(value) if value else 0.0
                    except ValueError:
                        measurements[size][measurement] = 0.0
        
        if chart_id:  # Update existing chart
            try:
                chart = get_object_or_404(SizeChart, id=chart_id)
                chart.name = name
                chart.gender = gender
                chart.size_type = size_type
                chart.measurements = measurements
                chart.save()
            except Exception as e:
                print(f"Error updating chart: {e}")
        else:  # Create new size chart
            SizeChart.objects.create(
                name=name,
                gender=gender,
                size_type=size_type,
                measurements=measurements,
                is_active=False
            )
        return redirect('size_chart_editor')
    
    # Handle activation toggle
    if 'toggle_active' in request.GET:
        try:
            chart_id = request.GET.get('toggle_active')
            chart = get_object_or_404(SizeChart, id=chart_id)
            
            # Deactivate all charts of same gender and size type
            SizeChart.objects.filter(
                gender=chart.gender,
                size_type=chart.size_type
            ).update(is_active=False)
            
            # Toggle current chart
            chart.is_active = not chart.is_active
            chart.save()
        except Exception as e:
            print(f"Error toggling chart: {e}")
        return redirect('size_chart_editor')
    
    # Handle deletion
    if 'delete' in request.GET:
        try:
            chart_id = request.GET.get('delete')
            SizeChart.objects.filter(id=chart_id).delete()
        except Exception as e:
            print(f"Error deleting chart: {e}")
        return redirect('size_chart_editor')
    
    # Handle edit mode
    edit_chart = None
    if 'edit' in request.GET:
        try:
            chart_id = request.GET.get('edit')
            edit_chart = get_object_or_404(SizeChart, id=chart_id)
        except Exception as e:
            print(f"Error loading chart for editing: {e}")
    
    # Get all size charts
    try:
        size_charts = SizeChart.objects.all()
    except Exception as e:
        print(f"Error fetching size charts: {e}")
        size_charts = []
    
    return render(request, 'managesizechart.html', {
        'size_charts': size_charts,
        'edit_chart': edit_chart
    })

def get_chart(request, chart_id):
    """API endpoint to get chart data by ID"""
    try:
        chart = get_object_or_404(SizeChart, id=chart_id)
        return JsonResponse({
            'id': chart.id,
            'name': chart.name,
            'gender': chart.gender,
            'size_type': chart.size_type,
            'measurements': chart.measurements,
            'is_active': chart.is_active
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)