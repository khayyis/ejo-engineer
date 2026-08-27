@echo off
title EJO ENGINEER - Laravel Server
cd /d "%~dp0laravel"
echo ========================================================
echo   Starting EJO Engineer System (Laravel 13 + PHP 8.4)
echo ========================================================
echo.
echo URL: http://localhost:8000
echo.
"C:\php\php.exe" artisan serve --host=0.0.0.0 --port=8000
pause
