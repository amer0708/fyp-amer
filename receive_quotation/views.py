from django.shortcuts import render

# Create your views here.
def receive_quotation(request):
    return render(request,"receive_quotation.html")