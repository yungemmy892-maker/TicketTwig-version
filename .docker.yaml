# Use official PHP 8.2 image with Apache
FROM php:8.2-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Copy the latest Composer binary
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files to container
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# Enable Apache mod_rewrite (important for clean URLs)
RUN a2enmod rewrite

# Copy Apache virtual host configuration
COPY apache.conf /etc/apache2/sites-available/000-default.conf

# Ensure Apache listens on Render's dynamic port
RUN sed -i 's/Listen 80/Listen ${PORT}/g' /etc/apache2/ports.conf

# Use production PHP config
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"

# Fix ownership and permissions
RUN chown -R www-data:www-data /var/www/html

# Expose Render's dynamic port
EXPOSE 10000

# Start Apache
CMD ["apache2-foreground"]
