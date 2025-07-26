from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.contrib import messages
from .models import Design
from django.core.files.base import ContentFile

@login_required
@csrf_protect
def customize(request):
    if request.method == 'POST':
        name = request.POST.get('name', 'Untitled Design')
        design_data = request.POST.get('design_data')  # JSON string from frontend
        image = request.FILES.get('image')
        svg_data = request.POST.get('svg_data')
        svg_file = None
        if svg_data:
            svg_file = ContentFile(svg_data.encode('utf-8'), name=f'design_{request.user.id}_{name}.svg')
        if not design_data:
            messages.error(request, "Design data is required.")
            return render(request, 'customize_clothes.html')
        design = Design.objects.create(
            user=request.user,
            name=name,
            design_data=design_data,
            image=image,
            svg_data=svg_data,
            svg_file=svg_file
        )
        request.session['design_id'] = design.id  # Store for next step
        return redirect('submit_order:submit_order')
    return render(request, 'customize_clothes.html')