# Generated by Django 4.2 on 2025-07-26 11:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('submit_order', '0001_initial'),
        ('review_order', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='orderreview',
            name='order',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='submit_order.order'),
        ),
    ]
