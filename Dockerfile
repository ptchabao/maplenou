# ==============================
# STAGE 1: Build Assets (Node.js)
# ==============================
FROM node:20-alpine AS assets-builder

# Install Python and build dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libsass-dev

ENV PYTHON=/usr/bin/python3

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install -g node-gyp@latest && \
    npm ci --frozen-lockfile || npm install

# Copy source and build
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
    oniguruma-dev \
    bash

# Install PHP extensions
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

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files
COPY composer.json composer.lock* ./

# Create necessary directories before composer install
RUN mkdir -p \
    database/seeders \
    database/factories \
    database/migrations \
    bootstrap/cache \
    storage/framework/cache \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    storage/app/public

# Copy files needed for composer
COPY artisan ./
COPY bootstrap/ ./bootstrap/

# Install PHP dependencies
RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-interaction \
    --no-scripts \
    --prefer-dist

# Copy application files
COPY --chown=www-data:www-data . .

# Copy built assets from node stage
COPY --from=assets-builder --chown=www-data:www-data /app/public/js ./public/js
COPY --from=assets-builder --chown=www-data:www-data /app/public/css ./public/css

# Copy manifest (check if it's mix-manifest.json or manifest.json for Vite)
COPY --from=assets-builder --chown=www-data:www-data /app/public/mix-manifest.json ./public/mix-manifest.json 2>/dev/null || true
COPY --from=assets-builder --chown=www-data:www-data /app/public/build ./public/build 2>/dev/null || true

# Run composer post-install scripts
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 storage bootstrap/cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Create entrypoint script
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=5 \
    CMD curl -f http://localhost/health || exit 1

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]