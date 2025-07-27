import os
from django.conf import settings
from django.http import FileResponse, Http404
from django.views.static import serve

def serve_media(request, path):
    """Custom view to serve media files in production"""
    file_path = os.path.join(settings.MEDIA_ROOT, path)
    
    if not os.path.exists(file_path):
        raise Http404("File not found")
    
    return serve(request, path, document_root=settings.MEDIA_ROOT) 