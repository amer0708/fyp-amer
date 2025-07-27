from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings

class Command(BaseCommand):
    help = 'Creates a default admin user if none exists.'

    def handle(self, *args, **kwargs):
        User = get_user_model()

        admin_data = {
            'username': settings.DJANGO_SUPERUSER_USERNAME,
            'email': settings.DJANGO_SUPERUSER_EMAIL,
            'password': settings.DJANGO_SUPERUSER_PASSWORD,
            'first_name': 'Admin',  # Default first name
            'last_name': 'User',    # Default last name
            'full_name': 'Admin User',  # Your custom field
            'phone': '+0000000000'  # Your custom field
        }

        if not User.objects.filter(username=admin_data['username']).exists():
            User.objects.create_superuser(**admin_data)
            self.stdout.write(self.style.SUCCESS(f"Superuser '{admin_data['username']}' created."))
        else:
            self.stdout.write(self.style.WARNING(f"Superuser '{admin_data['username']}' already exists."))