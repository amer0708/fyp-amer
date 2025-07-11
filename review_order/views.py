from django.shortcuts import render

# Create your views here.
def review_order(request):
    return render(request,"review_order.html")