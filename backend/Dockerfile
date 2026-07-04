FROM php:8.3-apache

# Cài đặt thư viện
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Bật rewrite và headers (Bắt buộc cho CORS)
RUN a2enmod rewrite headers

# Cài đặt PHP extensions cho MySQL
RUN docker-php-ext-install -j$(nproc) pdo pdo_mysql mysqli

# Copy toàn bộ code vào
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html

# Ghi đè file cấu hình gốc của Apache để ép mọi đường dẫn về index.php (KHÔNG DÙNG a2enconf NỮA)
RUN echo "<VirtualHost *:80>\n\
    DocumentRoot /var/www/html\n\
    <Directory /var/www/html>\n\
        Options Indexes FollowSymLinks\n\
        AllowOverride All\n\
        Require all granted\n\
        \n\
        RewriteEngine On\n\
        RewriteCond %{REQUEST_FILENAME} !-f\n\
        RewriteCond %{REQUEST_FILENAME} !-d\n\
        RewriteRule ^(.*)$ index.php [QSA,L]\n\
    </Directory>\n\
</VirtualHost>" > /etc/apache2/sites-available/000-default.conf

EXPOSE 80

CMD ["apache2-foreground"]