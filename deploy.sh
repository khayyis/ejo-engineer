#!/usr/bin/env bash
# ==============================================================================
# Script Auto Deploy EJO Engineer Web Platform + Cloudflare Tunnel
# PT. BAS - Engineering Job Order Web Platform
# ==============================================================================

set -e

echo "========================================================"
echo "🚀 Memulai Setup Otomatis EJO Engineer di VPS"
echo "========================================================"

# 1. Update paket sistem & install dependensi dasar
echo "📦 1/5 Mengupdate sistem dan memasang dependensi (Python3, Git, Curl)..."
sudo apt update -y && sudo apt install -y python3 python3-pip git curl wget

APP_DIR="/opt/ejo-engineer"
REPO_URL="https://github.com/khayyis/ejo-engineer.git"

# 2. Clone / Update Repositori
echo "📥 2/5 Mengambil source code dari GitHub..."
if [ -d "$APP_DIR" ]; then
    echo "Directory $APP_DIR sudah ada, melakukan git pull..."
    cd "$APP_DIR"
    git pull origin master
else
    echo "Melakukan clone repositori ke $APP_DIR..."
    sudo git clone "$REPO_URL" "$APP_DIR"
    sudo chown -R $USER:$USER "$APP_DIR"
    cd "$APP_DIR"
fi

# 3. Setup Direktori Uploads & Database Inisialisasi
echo "🗄️ 3/5 Mempersiapkan database & folder uploads..."
mkdir -p "$APP_DIR/uploads"
if [ ! -f "$APP_DIR/ejo_database.db" ]; then
    echo "Menginisialisasi database baru dengan seed data..."
    python3 "$APP_DIR/seed_dummy_data.py" || true
fi

# 4. Setup Systemd Service (Auto-run 24/7 & Auto-restart)
echo "⚙️ 4/5 Mengonfigurasi systemd background service..."
SERVICE_FILE="/etc/systemd/system/ejo-engineer.service"

sudo bash -c "cat <<EOF > $SERVICE_FILE
[Unit]
Description=EJO Engineer Web Platform Server
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/python3 $APP_DIR/server.py
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF"

sudo systemctl daemon-reload
sudo systemctl enable ejo-engineer
sudo systemctl restart ejo-engineer

echo "✅ Service ejo-engineer aktif dan berjalan di http://localhost:8000"

# 5. Pasang Cloudflare Tunnel (cloudflared)
echo "☁️ 5/5 Memeriksa instalasi Cloudflare Tunnel (cloudflared)..."
if ! command -v cloudflared &> /dev/null; then
    echo "Memasang cloudflared..."
    curl -fsSL https://pkg.cloudflare.com/cloudflare-main.gpg | sudo tee /usr/share/keyrings/cloudflare-main.gpg >/dev/null
    echo "deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared jammy main" | sudo tee /etc/apt/sources.list.d/cloudflared.list
    sudo apt update -y && sudo apt install -y cloudflared || {
        # Fallback binary download jika repository apt gagal
        wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
        sudo dpkg -i cloudflared-linux-amd64.deb
        rm -f cloudflared-linux-amd64.deb
    }
fi

echo ""
echo "========================================================"
echo "🎉 Setup Core EJO Engineer Berhasil!"
echo "Status Service: $(sudo systemctl is-active ejo-engineer)"
echo "Port Lokal: http://127.0.0.1:8000"
echo "========================================================"
echo ""
echo "👉 Untuk menghubungkan ke domain Anda via Cloudflare Tunnel,"
echo "   Jalankan: bash setup-cf-tunnel.sh"
echo "========================================================"
