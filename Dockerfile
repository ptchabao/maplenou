# Use PHP 8.1 FPM as base image
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
    nodejs \
    npm

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

# Copy composer files and install dependencies
COPY composer.json ./
COPY composer.lock* ./

# Copy artisan file needed for composer post-install scripts
COPY artisan ./

# Ensure database directories exist before composer install
RUN mkdir -p database/seeders database/factories

RUN composer install --no-dev --optimize-autoloader --no-interaction

# Copy package files and install Node dependencies
COPY package.json ./
COPY package-lock.json* ./
RUN npm ci --only=production || npm install --production

# Copy application files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage \
    && chmod -R 755 /var/www/html/bootstrap/cache

# Create necessary directories
RUN mkdir -p /var/www/html/storage/framework/cache \
    && mkdir -p /var/www/html/storage/framework/sessions \
    && mkdir -p /var/www/html/storage/framework/views \
    && mkdir -p /var/www/html/storage/logs

# Build assets
RUN npm run production \
    && php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Copy configuration files
COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Expose port
EXPOSE 80

# Start supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
