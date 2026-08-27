#!/bin/bash
set -e

# ==============================================================================
# Script Otomatis Deployment EJO Engineer Laravel (Linux / VPS / Ubuntu / Debian)
# ==============================================================================

echo "🚀 Memulai instalasi & deployment EJO Engineer (Laravel Framework)..."

# 1. Update paket sistem & install dependensi dasar
echo "📦 1/4 Mengupdate sistem dan memasang dependensi (PHP 8.3/8.4, Composer, SQLite, Nginx/Apache)..."
sudo apt update -y && sudo apt install -y php-cli php-fpm php-sqlite3 php-mbstring php-xml php-curl php-gd php-zip composer git curl wget nginx

APP_DIR="/opt/ejo-engineer/laravel"

# 2. Setup Direktori Aplikasi
echo "📁 2/4 Menyiapkan folder aplikasi di $APP_DIR..."
sudo mkdir -p /opt/ejo-engineer
sudo chown -R $USER:$USER /opt/ejo-engineer

# 3. Setup Permisi & Composer
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    echo "⚡ 3/4 Menginstall dependensi Composer..."
    composer install --no-dev --optimize-autoloader
    chmod -R 775 storage bootstrap/cache
fi

echo "✅ 4/4 Setup Laravel selesai! Aplikasi siap dijalankan."
