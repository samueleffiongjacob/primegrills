
#!/bin/sh

# python manage.py flush --no-input
# python manage.py migrate

set -e  # Exit script on any error

echo "Database type: $DATABASE"

if [ "$DATABASE" = "postgres" ]; then
    echo "Waiting for PostgreSQL to start..."

    while ! nc -z "$SQL_HOST" "$SQL_PORT"; do
        sleep 0.1
    done

    echo "PostgreSQL is up and running!"
fi

# Check if there are any unapplied migrations
if python manage.py showmigrations | grep -q '( )'; then
    echo "Applying migrations..."
    # Uncomment the next line only for debugging (clears the database)
    # python manage.py flush --no-input 
    python manage.py migrate
else
    echo "Migrations already applied. Skipping..."
fi

# Execute the container's main process (CMD)
exec "$@"
