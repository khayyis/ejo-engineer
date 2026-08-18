# Panduan Setup VPS & Hubungkan Domain via Cloudflare (EJO Engineer)

Panduan ini disiapkan agar Anda bisa menjalankan **EJO Engineer** di VPS (Ubuntu / Debian) dan langsung online ke domain Anda dalam **3 langkah mudah**. Tugas Anda cukup login Cloudflare ketika diminta.

---

## 📋 Prasyarat
1. **VPS baru** (OS: Ubuntu 22.04 / 24.04 atau Debian 11 / 12).
2. **Domain** yang sudah didaftarkan di Cloudflare (misal: `ejo.domainanda.com`).
3. Akses SSH / Terminal ke VPS Anda (`ssh root@ip-vps-anda`).

---

## 🚀 Langkah 1: Jalankan Script Auto-Deploy di Terminal VPS

Buka terminal SSH VPS Anda, lalu copy-paste perintah berikut dan tekan **Enter**:

```bash
# Download dan jalankan script deploy otomatis
curl -sSL https://raw.githubusercontent.com/khayyis/ejo-engineer/master/deploy.sh | bash
```

*Script ini akan otomatis menginstall Python, mengunduh source code EJO Engineer dari GitHub, mengaktifkan database, dan memasang background service agar web server berjalan 24/7.*

---

## ☁️ Langkah 2: Hubungkan Domain via Cloudflare Tunnel

Setelah langkah 1 selesai, masuk ke folder aplikasi dan jalankan script Cloudflare Tunnel:

```bash
cd /opt/ejo-engineer
bash setup-cf-tunnel.sh
```

### Yang Terjadi Saat Dijalankan:
1. **Otorisasi Cloudflare**: Terminal akan memunculkan link URL login Cloudflare.  
   👉 Cukup buka link tersebut di browser Anda, pilih domain Anda, dan klik **Authorize**.
2. **Ketik Domain**: Masukkan nama domain/subdomain Anda (misal: `ejo.perusahaananda.com`).
3. **Selesai**: Script akan otomatis mengarahkan traffic domain ke port 8000 dan mengaktifkan SSL/HTTPS gratis dari Cloudflare.

---

## 🌐 Selesai!

Website EJO Engineer Anda langsung bisa diakses dari mana saja melalui:
```
https://ejo.domainanda.com
```

### Perintah Berguna di VPS:
- **Cek status web server**: `sudo systemctl status ejo-engineer`
- **Cek status Cloudflare tunnel**: `sudo systemctl status cloudflared`
- **Restart web server**: `sudo systemctl restart ejo-engineer`
- **Lihat log server**: `sudo journalctl -u ejo-engineer -f`
- **Update kode ke versi terbaru GitHub**: `cd /opt/ejo-engineer && git pull origin master && sudo systemctl restart ejo-engineer`
