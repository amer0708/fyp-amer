from django.shortcuts import render

# Create your views here.
def submit_order(request):
    return render(request,"submit_order.html")