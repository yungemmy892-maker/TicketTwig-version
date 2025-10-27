# Use PHP with Apache
FROM php:8.2-apache

# Install necessary PHP extensions
RUN docker-php-ext-install pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy project files into container
COPY . /var/www/html

# Ensure proper permissions
RUN chown -R www-data:www-data /var/www/html

# Add default DirectoryIndex (this fixes the 403 error)
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/apache2.conf

# Expose port 80
EXPOSE 80


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
