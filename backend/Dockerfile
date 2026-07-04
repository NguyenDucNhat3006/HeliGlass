FROM php:8.3-apache

# Enable Apache modules
RUN a2enmod rewrite headers

# Install extensions
RUN docker-php-ext-install pdo pdo_mysql mysqli curl

# Copy application
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html

# Enable .htaccess
RUN echo '<Directory /var/www/html>\n    AllowOverride All\n    Require all granted\n</Directory>' > /etc/apache2/conf-available/htaccess.conf && \
    a2enconf htaccess

EXPOSE 80

CMD ["apache2-foreground"]
