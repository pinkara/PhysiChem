# 🚀 Configuration de PhysChim

Ce guide explique comment configurer entièrement le projet PhysChim avec GitHub Pages et Supabase.

## 📋 Prérequis

- **Node.js** 18+ ([télécharger](https://nodejs.org/))
- **npm** (inclus avec Node.js)
- Un compte **GitHub**
- Un compte **Supabase** ([s'inscrire](https://supabase.com/))
- **PowerShell** (Windows) ou **Bash** (Linux/Mac)

---

## ⚡ Configuration rapide (Automatique)

### Étape 1 : Exécuter le script de setup

```powershell
# Dans PowerShell (en administrateur si nécessaire)
cd C:\Users\tomam\OneDrive\Documents\projet_sur_VSC\physichem
.\setup-physchim.ps1
```

Ce script va :
- ✅ Vérifier Node.js et npm
- ✅ Créer le fichier `.env` avec vos credentials Supabase
- ✅ Installer les dépendances (`npm ci`)
- ✅ Tester le build
- ✅ Afficher les instructions pour GitHub Secrets

---

## 🔧 Configuration manuelle (Détaillée)

### 1. Fichier `.env` local

Créez le fichier `app/.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon-xxxxxxxx
```

> ⚠️ **Important** : Ce fichier ne doit JAMAIS être commité (déjà dans `.gitignore`)

### 2. Secrets GitHub

Dans votre repo GitHub → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Nom | Valeur | Exemple |
|-----|--------|---------|
| `VITE_SUPABASE_URL` | URL de votre projet Supabase | `https://abc123.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Clé anonyme (public) | `eyJhbGciOiJIUzI1NiIs...` |

### 3. Configuration Supabase

#### A. Créer les buckets Storage

Dans Supabase → **Storage** → **New bucket** :

| Bucket | Public | Types MIME |
|--------|--------|------------|
| `courses-images` | ✅ ON | `image/png, image/jpeg, image/gif` |
| `books` | ✅ ON | `application/pdf, image/png` |
| `molecules` | ✅ ON | `image/png, image/svg+xml` |

#### B. Créer les tables et policies

Dans Supabase → **SQL Editor** → **New query**, collez le contenu du fichier [`setup-supabase.sql`](./setup-supabase.sql) puis cliquez sur **Run**.

Ou exécutez le SQL minimal :

```sql
-- Activer UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table courses
CREATE TABLE courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow admin write" ON courses FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Vérifier le workflow GitHub Actions

Le fichier [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) doit contenir :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: app/package-lock.json
      
      - name: Install dependencies
        working-directory: ./app
        run: npm ci
      
      - name: Build
        working-directory: ./app
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./app/dist
```

### 5. Activer GitHub Pages

Dans GitHub → **Settings** → **Pages** :
- **Source** : `Deploy from a branch`
- **Branch** : `gh-pages` / `(root)`
- ✅ **Enforce HTTPS**

---

## 🧪 Tests avant déploiement

### Test local

```bash
cd app
npm install
npm run dev    # Démarre le serveur de développement
```

Accédez à `http://localhost:5173`

### Test du build

```bash
cd app
npm run build
```

Si le build réussit, le dossier `app/dist` est créé.

---

## 📤 Déploiement

Une fois tout configuré :

```bash
git add .
git commit -m "Configuration initiale"
git push origin main
```

Le site sera automatiquement déployé sur `https://votre-username.github.io/physichem/` 🎉

---

## 🔍 Dépannage

### Erreur "Cannot find module"

```bash
cd app
rm -rf node_modules package-lock.json
npm install
```

### Erreur "VITE_SUPABASE_URL is not defined"

Vérifiez que :
1. Le fichier `app/.env` existe avec les bonnes valeurs
2. Les secrets GitHub sont configurés
3. Le workflow utilise bien `env:` avec les secrets

### Erreur TypeScript

```bash
cd app
npx tsc -b --force
```

Corriger les erreurs affichées.

### Déploiement échoue

Vérifiez dans GitHub → **Actions** → le workflow en cours :
1. Cliquez sur le workflow failed
2. Regardez les logs de l'étape "Build"
3. Corrigez l'erreur et poussez à nouveau

---

## 📚 Structure du projet

```
physichem/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Workflow de déploiement
├── app/
│   ├── .env                    # Variables d'environnement (local)
│   ├── .env.example            # Exemple de configuration
│   ├── src/
│   │   ├── lib/
│   │   │   └── supabase.ts     # Client Supabase
│   │   └── ...
│   └── dist/                   # Build de production (généré)
├── setup-physchim.ps1          # Script de setup automatique
├── setup-supabase.sql          # SQL pour créer les tables
└── SETUP.md                    # Ce fichier
```

---

## ✅ Checklist finale

Avant le premier push :

- [ ] Fichier `app/.env` créé avec les bonnes valeurs
- [ ] Secrets GitHub configurés (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] Tables Supabase créées via SQL Editor
- [ ] Buckets Storage créés et publics
- [ ] RLS activé avec les bonnes policies
- [ ] `npm run build` fonctionne en local
- [ ] GitHub Pages activé (branche `gh-pages`)

---

Besoin d'aide ? Ouvrez une issue sur GitHub ou consultez la [documentation Supabase](https://supabase.com/docs).
