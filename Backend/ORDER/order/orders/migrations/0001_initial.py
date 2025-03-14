# Generated by Django 5.1.6 on 2025-03-11 15:40

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('customers', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Orders',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('object_id', models.PositiveIntegerField()),
                ('order_id', models.CharField(max_length=20, unique=True)),
                ('date', models.DateField()),
                ('time', models.TimeField()),
                ('status', models.CharField(choices=[('PENDING', 'pending'), ('complete', 'complete'), ('cancelled', 'cancelled')], default='PENDING', max_length=50)),
                ('total', models.DecimalField(decimal_places=2, max_digits=10)),
                ('reason', models.CharField(max_length=50)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('content_type', models.ForeignKey(limit_choices_to={'model__in': ('customer', 'posstaff')}, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'verbose_name': 'Orders',
                'verbose_name_plural': 'Orders',
                'db_table': 'orders',
                'managed': True,
            },
        ),
        migrations.CreateModel(
            name='OrderItems',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('image', models.URLField(blank=True, null=True)),
                ('food_product', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='customers.foodproduct')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='orders.orders')),
            ],
        ),
    ]
