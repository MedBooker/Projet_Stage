FROM php:8.2-cli

# Installer les dépendances système + SSL
RUN apt-get update && apt-get install -y \
    git unzip libzip-dev \
    libssl-dev openssl \
    && docker-php-ext-install zip \
    && pecl install mongodb \
    && docker-php-ext-enable mongodb

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier l'application et le script
WORKDIR /app
COPY . .
COPY startup.sh /app/startup.sh

# Installer les dépendances et permissions
RUN composer install --optimize-autoloader --no-dev \
    && chmod +x /app/startup.sh \
    && chown -R www-data:www-data /app/storage

EXPOSE 8000
CMD ["/app/startup.sh"]
