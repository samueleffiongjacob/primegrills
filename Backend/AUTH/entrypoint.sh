#!/bin/sh

echo "⏳ Waiting for PostgreSQL to be ready..."
until pg_isready -h "$SQL_HOST" -p "$SQL_PORT" -U "$SQL_USER"; do
    echo "Waiting for PostgreSQL..."
    sleep 10
done

echo "✅ PostgreSQL is ready! Running migrations..."
cd /AUTH/auth  
python manage.py makemigrations  # Generate migration files
python manage.py migrate --noinput

echo "✅ Migrations complete! Ensuring manager user exists..."
python manage.py create_manager
echo "✅ Manager create!..."

echo "✅ Starting server..."
if [ "$MODE" = "development" ]; then
    exec python manage.py runserver 0.0.0.0:8000
else
    exec gunicorn --bind 0.0.0.0:8000 auth.wsgi:application
fi
