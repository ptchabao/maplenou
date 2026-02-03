#!/bin/bash
set -e

# Wait for database if needed
if [ ! -z "$DB_HOST" ]; then
    echo "Waiting for database..."
    while ! nc -z $DB_HOST ${DB_PORT:-3306}; do
        sleep 1
    done
    echo "Database is ready!"
fi

# Fix permissions for storage and cache
echo "Fixing permissions..."
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Run migrations (only if APP_ENV is not local)
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force --no-interaction
fi

# Clear and cache config (only with .env present)
if [ -f .env ]; then
    echo "Optimizing Laravel..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
fi

# Create storage link if needed
php artisan storage:link || true

exec "$@"