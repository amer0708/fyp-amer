from django.shortcuts import render

# Create your views here.
def customize_clothes(request):
    return render(request,"customize_clothes.html")