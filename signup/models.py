from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

class User(AbstractUser):
    """
    Extend the default Django user model by adding custom fields,
    without changing the standard username, email, and authentication logic.
    """
    full_name = models.CharField(_('full name'), max_length=100, null=True, blank=True)
    phone = models.CharField(_('phone number'), max_length=15, null=True, blank=True)

    def __str__(self):
        return self.username
