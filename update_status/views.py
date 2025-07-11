from django.shortcuts import render

# Create your views here.
def update_status(request):
    return render(request,"update_status.html")