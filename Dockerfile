# ==============================
# STAGE 1: Build Frontend Assets
# ==============================
FROM node:20-alpine AS assets-builder

WORKDIR /app

# Copy package files first (better cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy frontend source
COPY . .

# Build production assets
RUN npm run production


# ==============================
# STAGE 2: PHP + Nginx + Supervisor
# ==============================
FROM php:8.1-fpm-alpine

# System dependencies
RUN apk add --no-cache \
    nginx \
    supervisor \
    bash \
    curl \
    libzip-dev \
    zip \
    icu-dev \
    jpeg-dev \
    libpng-dev \
    freetype-dev \
    libxml2-dev \
    oniguruma-dev

# PHP extensions
RUN docker-php-ext-configure gd --with-freetype --with-jpeg && \
    docker-php-ext-install -j$(nproc) \
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

# Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock ./

# Required Laravel directories
RUN mkdir -p \
    bootstrap/cache \
    storage/app/public \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs

# Minimal Laravel files needed for composer
COPY artisan ./
COPY bootstrap/ ./bootstrap/

# Install PHP dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --prefer-dist

# Copy full source
COPY --chown=www-data:www-data . .

# Copy frontend assets from Node build
COPY --from=assets-builder --chown=www-data:www-data /app/public ./public

# Optimize autoload
RUN composer dump-autoload --optimize

# Permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache

# Configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Entrypoint
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
