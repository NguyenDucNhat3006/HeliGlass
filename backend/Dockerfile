FROM php:8.3-apache

# Cài đặt các thư viện cần thiết
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Bật các module quan trọng của Apache
RUN a2enmod rewrite headers

# Cài đặt PHP extensions
RUN docker-php-ext-install -j$(nproc) pdo pdo_mysql mysqli

# Copy toàn bộ code vào thư mục web
COPY . /var/www/html/

# Phân quyền cho Apache
RUN chown -R www-data:www-data /var/www/html

RUN echo "<Directory /var/www/html>\n\
    AllowOverride All\n\
    Require all granted\n\
    FallbackResource /index.php\n\
</Directory>" > /etc/apache2/conf-available/custom-routing.conf \
    && a2enconf custom-routing

EXPOSE 80

CMD ["apache2-foreground"]