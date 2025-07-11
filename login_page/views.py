from django.shortcuts import render

# Create your views here.
def login_customer(request):
    return render(request,"login_cust.html")

def login_admin(request):
    return render(request,"login_admin.html")