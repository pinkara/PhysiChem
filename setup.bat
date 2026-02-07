@echo off
chcp 65001 >nul
title PhysChim - Configuration

echo ========================================
echo    PhysChim - Configuration Setup
echo ========================================
echo.

:: Vérifier si PowerShell est disponible
where powershell >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] PowerShell n'est pas disponible.
    pause
    exit /b 1
)

:: Lancer le script PowerShell
echo Lancement du script de configuration...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0setup-physchim.ps1"

pause
