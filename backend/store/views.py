from django.http import JsonResponse

# Create your views here.
def home(request):
    data = {
        'message': 'Hello, World!'
    }
    return JsonResponse(data)
