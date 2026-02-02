# ==============================
# STAGE 1: Build Assets (Node.js)
# ==============================
FROM node:20-alpine AS assets-builder

# Install Python and build dependencies for node-sass
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libsass-dev

WORKDIR /app

# Cache dependencies
COPY package.json package-lock.json* ./
RUN npm ci --frozen-lockfile || npm install

# Copy sources & build
COPY . .
RUN npm run production

# ==============================
# STAGE 2: PHP + Nginx (Laravel)
# ==============================
FROM php:8.1-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    libzip-dev \
    zip \
    icu-dev \
    jpeg-dev \
    libpng-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev

# Install PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) \
        gd \
        pdo_mysql \
        mysqli \
        zip \
        intl \
        bcmath \
        opcache \
        xml \
        dom \
        simplexml

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock* ./

# Copy artisan file and bootstrap directory needed for composer post-install scripts
COPY artisan ./
COPY bootstrap/ ./bootstrap/

# Ensure database directories exist before composer install
RUN mkdir -p database/seeders database/factories

# Install dependencies without scripts first
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist

# Copy application source
COPY --chown=www-data:www-data . .

# Copy Vite build from assets-builder
COPY --from=assets-builder \
    --chown=www-data:www-data \
    /app/public/js ./public/js
COPY --from=assets-builder \
    --chown=www-data:www-data \
    /app/public/css ./public/css
COPY --from=assets-builder \
    --chown=www-data:www-data \
    /app/public/mix-manifest.json ./public/mix-manifest.json

# Run composer scripts after full copy
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create necessary directories
RUN mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

# Optimize Laravel
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Expose port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=90s --retries=5 \
    CMD curl -f http://localhost:80 -o /dev/null -s -w '%{http_code}' | grep -q -E '^[23]' || exit 1

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
