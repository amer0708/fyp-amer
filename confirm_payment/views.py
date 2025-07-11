from django.shortcuts import render

# Create your views here.
def confirm_payment(request):
    return render(request,"confirm_payment.html")