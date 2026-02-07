#Requires -Version 5.1
<#
.SYNOPSIS
    Script de configuration et vérification pour PhysChim
.DESCRIPTION
    Ce script permet de :
    - Vérifier les prérequis (Node.js, npm)
    - Créer/mettre à jour le fichier .env
    - Vérifier la configuration Supabase
    - Afficher les instructions pour GitHub Secrets
.EXAMPLE
    .\setup-physchim.ps1
#>

$ErrorActionPreference = "Stop"

# Couleurs
$Green = "Green"
$Red = "Red"
$Yellow = "Yellow"
$Cyan = "Cyan"

# Header
Write-Host "`n========================================" -ForegroundColor $Cyan
Write-Host "    PhysChim - Configuration Setup" -ForegroundColor $Cyan
Write-Host "========================================`n" -ForegroundColor $Cyan

# Chemins
$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$AppDir = Join-Path $ProjectRoot "app"
$EnvFile = Join-Path $AppDir ".env"
$EnvExample = Join-Path $AppDir ".env.example"

# ============================================
# 1. Vérification des prérequis
# ============================================
Write-Host "🔍 Vérification des prérequis..." -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

# Node.js
$nodeVersion = $null
try {
    $nodeVersion = node --version 2>$null
} catch {}

if ($nodeVersion) {
    Write-Host "✅ Node.js trouvé : $nodeVersion" -ForegroundColor $Green
} else {
    Write-Host "❌ Node.js non trouvé" -ForegroundColor $Red
    Write-Host "   → Téléchargez Node.js 18+ : https://nodejs.org/" -ForegroundColor $Yellow
    exit 1
}

# npm
$npmVersion = $null
try {
    $npmVersion = npm --version 2>$null
} catch {}

if ($npmVersion) {
    Write-Host "✅ npm trouvé : v$npmVersion" -ForegroundColor $Green
} else {
    Write-Host "❌ npm non trouvé" -ForegroundColor $Red
    exit 1
}

# Vérifier la version de Node (doit être >= 18)
$majorVersion = [int]($nodeVersion -replace '^v' -replace '\..*$')
if ($majorVersion -lt 18) {
    Write-Host "⚠️  Node.js v18+ recommandé (actuel : $nodeVersion)" -ForegroundColor $Yellow
} else {
    Write-Host "✅ Version de Node.js compatible" -ForegroundColor $Green
}

Write-Host ""

# ============================================
# 2. Vérification de la structure du projet
# ============================================
Write-Host "📁 Vérification de la structure..." -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

$requiredFiles = @(
    @{ Path = "$AppDir\package.json"; Name = "package.json" },
    @{ Path = "$AppDir\index.html"; Name = "index.html" },
    @{ Path = "$AppDir\vite.config.ts"; Name = "vite.config.ts" },
    @{ Path = "$ProjectRoot\.github\workflows\deploy.yml"; Name = "GitHub Actions workflow" }
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file.Path) {
        Write-Host "✅ $($file.Name)" -ForegroundColor $Green
    } else {
        Write-Host "❌ $($file.Name) manquant" -ForegroundColor $Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n⚠️  Certains fichiers requis sont manquants !" -ForegroundColor $Yellow
}

Write-Host ""

# ============================================
# 3. Configuration du fichier .env
# ============================================
Write-Host "⚙️  Configuration Supabase (.env)..." -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

$envExists = Test-Path $EnvFile
$currentUrl = ""
$currentKey = ""

if ($envExists) {
    Write-Host "📄 Fichier .env existant trouvé" -ForegroundColor $Green
    $envContent = Get-Content $EnvFile -Raw
    
    # Extraire les valeurs actuelles
    if ($envContent -match 'VITE_SUPABASE_URL=(.+)$') {
        $currentUrl = $Matches[1].Trim()
    }
    if ($envContent -match 'VITE_SUPABASE_ANON_KEY=(.+)$') {
        $currentKey = $Matches[1].Trim()
    }
    
    # Masquer la clé pour l'affichage
    $maskedKey = if ($currentKey -and $currentKey -notmatch 'votre-cle') {
        $currentKey.Substring(0, [Math]::Min(10, $currentKey.Length)) + "..."
    } else {
        "(non configurée)"
    }
    
    Write-Host "   URL actuelle : $currentUrl" -ForegroundColor $Yellow
    Write-Host "   Clé actuelle : $maskedKey" -ForegroundColor $Yellow
    Write-Host ""
}

# Demander si l'utilisateur veut mettre à jour
$updateEnv = $true
if ($envExists -and ($currentUrl -notmatch 'votre-url' -and $currentKey -notmatch 'votre-cle')) {
    $response = Read-Host "Voulez-vous mettre à jour la configuration ? (O/n)"
    $updateEnv = ($response -ne 'n' -and $response -ne 'N')
}

if ($updateEnv) {
    Write-Host "`n📝 Entrez vos informations Supabase :" -ForegroundColor $Cyan
    Write-Host "   (Laissez vide pour garder la valeur actuelle)`n"
    
    # URL Supabase
    $defaultUrl = if ($currentUrl -and $currentUrl -notmatch 'votre-url') { $currentUrl } else { "" }
    $urlPrompt = if ($defaultUrl) { "URL Supabase [$defaultUrl]" } else { "URL Supabase (ex: https://xxx.supabase.co)" }
    $newUrl = Read-Host $urlPrompt
    if (-not $newUrl) { $newUrl = $defaultUrl }
    
    # Clé Anon
    $defaultKey = if ($currentKey -and $currentKey -notmatch 'votre-cle') { $currentKey } else { "" }
    $keyPrompt = if ($defaultKey) { "Clé Anon [$defaultKey...]" } else { "Clé Anon (ex: eyJhbGciOiJIUzI1NiIs...)" }
    $newKey = Read-Host $keyPrompt
    if (-not $newKey) { $newKey = $defaultKey }
    
    # Valider l'URL
    if ($newUrl -and $newKey) {
        if ($newUrl -match '^https://.*\.supabase\.co$') {
            $envContent = @"# Configuration Supabase
# Généré automatiquement le $(Get-Date -Format "yyyy-MM-dd HH:mm")

VITE_SUPABASE_URL=$newUrl
VITE_SUPABASE_ANON_KEY=$newKey
"@
            Set-Content -Path $EnvFile -Value $envContent -Encoding UTF8
            Write-Host "`n✅ Fichier .env créé/mis à jour avec succès !" -ForegroundColor $Green
        } else {
            Write-Host "`n❌ URL invalide. Format attendu : https://xxx.supabase.co" -ForegroundColor $Red
        }
    } else {
        Write-Host "`n⚠️  Configuration annulée (valeurs manquantes)" -ForegroundColor $Yellow
    }
}

Write-Host ""

# ============================================
# 4. Instructions GitHub Secrets
# ============================================
Write-Host "🔐 Configuration GitHub Secrets" -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

if (Test-Path $EnvFile) {
    $envContent = Get-Content $EnvFile -Raw
    
    if ($envContent -match 'VITE_SUPABASE_URL=(.+)$') {
        $url = $Matches[1].Trim()
    }
    if ($envContent -match 'VITE_SUPABASE_ANON_KEY=(.+)$') {
        $key = $Matches[1].Trim()
    }
    
    if ($url -and $key -and $url -notmatch 'votre-url' -and $key -notmatch 'votre-cle') {
        Write-Host "📋 Ajoutez ces secrets dans GitHub :" -ForegroundColor $Cyan
        Write-Host "   Settings → Secrets and variables → Actions → New repository secret`n" -ForegroundColor $Yellow
        
        Write-Host "   Nom : VITE_SUPABASE_URL" -ForegroundColor $Green
        Write-Host "   Valeur : $url`n" -ForegroundColor $Gray
        
        Write-Host "   Nom : VITE_SUPABASE_ANON_KEY" -ForegroundColor $Green
        Write-Host "   Valeur : $key`n" -ForegroundColor $Gray
        
        Write-Host "✅ Ces valeurs sont prêtes à être copiées !" -ForegroundColor $Green
    } else {
        Write-Host "⚠️  Configurez d'abord le fichier .env pour voir les valeurs" -ForegroundColor $Yellow
    }
}

Write-Host ""

# ============================================
# 5. Installation des dépendances
# ============================================
Write-Host "📦 Installation des dépendances..." -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

$nodeModulesExists = Test-Path "$AppDir\node_modules"
if ($nodeModulesExists) {
    Write-Host "✅ node_modules existe déjà" -ForegroundColor $Green
    $reinstall = Read-Host "Voulez-vous réinstaller les dépendances ? (o/N)"
    if ($reinstall -eq 'o' -or $reinstall -eq 'O') {
        $nodeModulesExists = $false
    }
}

if (-not $nodeModulesExists) {
    Write-Host "⏳ Installation en cours..." -ForegroundColor $Yellow
    Push-Location $AppDir
    try {
        npm ci
        Write-Host "`n✅ Dépendances installées avec succès !" -ForegroundColor $Green
    } catch {
        Write-Host "`n❌ Erreur lors de l'installation" -ForegroundColor $Red
        Write-Host $_.Exception.Message -ForegroundColor $Red
    } finally {
        Pop-Location
    }
}

Write-Host ""

# ============================================
# 6. Test de build local
# ============================================
Write-Host "🔨 Test de build local..." -ForegroundColor $Cyan
Write-Host "----------------------------------------`n"

$testBuild = Read-Host "Voulez-vous tester le build maintenant ? (o/N)"
if ($testBuild -eq 'o' -or $testBuild -eq 'O') {
    Push-Location $AppDir
    try {
        Write-Host "⏳ Build en cours..." -ForegroundColor $Yellow
        npm run build 2>&1 | ForEach-Object {
            if ($_ -match "error|Error|ERROR") {
                Write-Host $_ -ForegroundColor $Red
            } else {
                Write-Host $_
            }
        }
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`n✅ Build réussi !" -ForegroundColor $Green
        } else {
            Write-Host "`n❌ Build échoué" -ForegroundColor $Red
        }
    } catch {
        Write-Host "`n❌ Erreur lors du build" -ForegroundColor $Red
    } finally {
        Pop-Location
    }
}

Write-Host ""

# ============================================
# Résumé
# ============================================
Write-Host "========================================" -ForegroundColor $Cyan
Write-Host "           Résumé" -ForegroundColor $Cyan
Write-Host "========================================`n" -ForegroundColor $Cyan

$checks = @(
    @{ Label = "Node.js"; Pass = $null -ne $nodeVersion },
    @{ Label = "npm"; Pass = $null -ne $npmVersion },
    @{ Label = "Fichier .env"; Pass = Test-Path $EnvFile },
    @{ Label = "node_modules"; Pass = Test-Path "$AppDir\node_modules" }
)

foreach ($check in $checks) {
    $icon = if ($check.Pass) { "✅" } else { "❌" }
    $color = if ($check.Pass) { $Green } else { $Red }
    Write-Host "$icon $($check.Label)" -ForegroundColor $color
}

Write-Host "`n📚 Prochaines étapes :" -ForegroundColor $Cyan
Write-Host "   1. Configurez les secrets GitHub (voir ci-dessus)" -ForegroundColor $Yellow
Write-Host "   2. Créez les tables Supabase (voir SETUP_SUPABASE.md)" -ForegroundColor $Yellow
Write-Host "   3. Faites un commit et push :" -ForegroundColor $Yellow
Write-Host "      git add ." -ForegroundColor $Gray
Write-Host "      git commit -m 'Configuration initiale'" -ForegroundColor $Gray
Write-Host "      git push origin main" -ForegroundColor $Gray
Write-Host "`n🚀 Après le push, le site sera déployé automatiquement !" -ForegroundColor $Green
Write-Host ""

Pause
