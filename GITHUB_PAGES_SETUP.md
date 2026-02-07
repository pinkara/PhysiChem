# Configuration GitHub Pages pour PhysiChem

## 🔧 Étapes à suivre sur GitHub

### 1. Accéder aux paramètres
- Va sur ton repo : https://github.com/pinkara/PhysiChem
- Clique sur **Settings** (en haut à droite)
- Dans le menu de gauche, clique sur **Pages**

### 2. Configurer la source
Dans la section **"Build and deployment"** :

| Paramètre | Valeur |
|-----------|--------|
| **Source** | Sélectionne **"Deploy from a branch"** |
| **Branch** | Sélectionne **"gh-pages"** |
| **Folder** | Laisse **"/(root)"** |

Clique sur **Save**

### 3. Attendre le déploiement
- Le déploiement peut prendre 2-5 minutes
- Rafraîchis la page https://pinkara.github.io/PhysiChem/

### 4. Vérifier le statut
- Va dans l'onglet **Actions** de ton repo
- Vérifie que le workflow "Deploy to GitHub Pages" est vert ✅

---

## 🚨 Si ça ne marche pas

### Option alternative : Utiliser GitHub Actions directement

Si la branche gh-pages n'apparaît pas, configure comme ceci :

1. **Settings → Pages → Source**
2. Sélectionne **"GitHub Actions"** au lieu de "Deploy from a branch"
3. Le workflow que j'ai mis en place s'occupera du reste

---

## 📁 Structure attendue

Le site doit être servi depuis la branche `gh-pages` à la racine :

```
gh-pages/
├── index.html
├── assets/
│   ├── index-XXX.js
│   └── index-XXX.css
└── ...
```

---

## 🔍 Diagnostic rapide

### Vérifier si gh-pages existe :
```bash
git branch -r
```
Tu dois voir : `origin/gh-pages`

### Vérifier le contenu de gh-pages :
```bash
git ls-tree origin/gh-pages
```
Tu dois voir `index.html` et le dossier `assets/`

---

## ❓ Problèmes courants

### "404 File not found"
- Attends 2-5 minutes que le DNS se propage
- Vérifie que le fichier `index.html` existe bien dans gh-pages

### Page blanche
- Ouvre les DevTools (F12) → Console
- Vérifie s'il y a des erreurs 404 sur les fichiers JS/CSS

### "There isn't a GitHub Pages site here"
- Vérifie que le repo est public (Settings → General → Visibility)
- Vérifie que GitHub Pages est activé dans les paramètres

---

## ✅ Vérification finale

Une fois configuré, l'URL https://pinkara.github.io/PhysiChem/ doit afficher :
- Le site PhysiChem (pas le README)
- Le tableau périodique et toutes les fonctionnalités
- Le design avec le dégradé violet-rose

Si tu vois toujours le README, envoie-moi une capture d'écran de ta config GitHub Pages !
