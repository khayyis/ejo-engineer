@echo off
echo ========================================================
echo   Starting Cloudflare Tunnel for ejo.nft.biz.id
echo ========================================================
cloudflared.exe tunnel --config "%USERPROFILE%\.cloudflared\config.yml" run ejo-tunnel
pause
