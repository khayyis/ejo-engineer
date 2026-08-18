#!/usr/bin/env bash
# ==============================================================================
# Script Otomatis Setup Cloudflare Tunnel ke Domain
# PT. BAS - Engineering Job Order Web Platform
# ==============================================================================

set -e

echo "========================================================"
echo "☁️  SETUP CLOUDFLARE TUNNEL KE DOMAIN"
echo "========================================================"

# Cek cloudflared
if ! command -v cloudflared &> /dev/null; then
    echo "❌ cloudflared belum terpasang. Jalankan deploy.sh terlebih dahulu."
    exit 1
fi

echo ""
echo "👉 Langkah 1: Otorisasi Login Cloudflare"
echo "Silakan klik/buka URL yang muncul di bawah ini di browser Anda untuk login Cloudflare."
echo "--------------------------------------------------------"
cloudflared tunnel login

echo ""
echo "✅ Login Cloudflare berhasil!"
echo "--------------------------------------------------------"

# Input Domain
read -p "Masukkan nama domain/subdomain Anda (contoh: ejo.domainanda.com): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    echo "❌ Domain tidak boleh kosong."
    exit 1
fi

TUNNEL_NAME="ejo-tunnel"

# Hapus tunnel lama jika ada
cloudflared tunnel delete -f "$TUNNEL_NAME" 2>/dev/null || true

# Buat tunnel baru
echo ""
echo "👉 Langkah 2: Membuat Tunnel Cloudflare ($TUNNEL_NAME)..."
TUNNEL_OUTPUT=$(cloudflared tunnel create "$TUNNEL_NAME")
echo "$TUNNEL_OUTPUT"

TUNNEL_ID=$(echo "$TUNNEL_OUTPUT" | grep -oE '[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}' | head -n 1)

if [ -z "$TUNNEL_ID" ]; then
    # Cari di direktori ~/.cloudflared/*.json
    TUNNEL_JSON=$(ls ~/.cloudflared/*.json 2>/dev/null | head -n 1)
    if [ -n "$TUNNEL_JSON" ]; then
        TUNNEL_ID=$(basename "$TUNNEL_JSON" .json)
    fi
fi

if [ -z "$TUNNEL_ID" ]; then
    echo "❌ Gagal mendapatkan ID Tunnel. Cek folder ~/.cloudflared."
    exit 1
fi

echo "✅ Tunnel ID: $TUNNEL_ID"

# Konfigurasi routing DNS Cloudflare
echo ""
echo "👉 Langkah 3: Menghubungkan Domain $DOMAIN_NAME ke Tunnel..."
cloudflared tunnel route dns "$TUNNEL_NAME" "$DOMAIN_NAME" || true

# Tulis config.yml
CONFIG_FILE="$HOME/.cloudflared/config.yml"
mkdir -p "$HOME/.cloudflared"

cat <<EOF > "$CONFIG_FILE"
tunnel: $TUNNEL_ID
credentials-file: $HOME/.cloudflared/$TUNNEL_ID.json

ingress:
  - hostname: $DOMAIN_NAME
    service: http://localhost:8000
  - service: http_status:404
EOF

echo "✅ File konfigurasi dibuat di $CONFIG_FILE"

# Install cloudflared sebagai Systemd Service
echo ""
echo "👉 Langkah 4: Memasang Cloudflare Tunnel sebagai Service Otomatis..."
sudo cloudflared service uninstall 2>/dev/null || true
sudo cloudflared --config "$CONFIG_FILE" service install || true
sudo systemctl daemon-reload
sudo systemctl enable cloudflared || true
sudo systemctl restart cloudflared || true

echo ""
echo "========================================================"
echo "🎉 SELAMAT! EJO ENGINEER SUDAH LIVE & ONLINE!"
echo "========================================================"
echo "🌐 URL Domain : https://$DOMAIN_NAME"
echo "🔒 SSL / HTTPS: Aktif Otomatis via Cloudflare"
echo "========================================================"
