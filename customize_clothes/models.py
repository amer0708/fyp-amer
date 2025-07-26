from django.db import models
from django.conf import settings

class Design(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    design_data = models.JSONField()  # Store colors, elements, pockets, etc.
    image = models.ImageField(upload_to='design_images/', blank=True, null=True)
    svg_data = models.TextField(blank=True, null=True)  # Store SVG markup
    svg_file = models.FileField(upload_to='design_svgs/', blank=True, null=True)  # Store SVG as file
    created_at = models.DateTimeField(auto_now_add=True)

    def render_svg(self):
        svg_content = None
        with open(self.svg_file.path, 'r', encoding='utf-8') as f:
            svg_content = f.read()
        return svg_content

    def __str__(self):
        return f"{self.name} ({self.user})"