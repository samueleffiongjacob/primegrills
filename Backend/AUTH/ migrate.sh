#!/bin/sh

echo "Running makemigrations..."
python manage.py makemigrations

echo "Running migrations..."
python manage.py migrate

echo "Starting the app..."
exec gunicorn --bind 0.0.0.0:8000 authservice.wsgi:application
