FROM php:8.3-apache

# Update package manager
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Enable Apache modules
RUN a2enmod rewrite headers

# Install PHP extensions
RUN docker-php-ext-install -j$(nproc) pdo pdo_mysql mysqli

# Copy application
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Enable .htaccess
RUN sed -i 's/<Directory \/var\/www\/html>\n  Options Indexes FollowSymLinks\n  AllowOverride None/<Directory \/var\/www\/html>\n  Options Indexes FollowSymLinks\n  AllowOverride All/' /etc/apache2/sites-available/000-default.conf || true

RUN echo '<Directory /var/www/html>\n    AllowOverride All\n    Require all granted\n</Directory>' > /etc/apache2/conf-available/htaccess.conf && \
    a2enconf htaccess

EXPOSE 80

CMD ["apache2-foreground"]
