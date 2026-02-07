# ⚗️ PhysiChem

Encyclopédie de chimie et physique avec cours, problèmes, formules, librairie et visualisation moléculaire 3D.

## 🌐 Site en ligne

Accédez au site ici : **https://pinkara.github.io/PhysiChem/**

## ✨ Fonctionnalités

- 📚 **Cours** : Apprenez avec des cours structurés par niveau et catégorie
- 🧩 **Problèmes** : Entraînez-vous avec des exercices de difficulté variée
- 📝 **Formules** : Consultez une bibliothèque de formules de chimie et physique
- 🧬 **Molécules 3D** : Visualisez les molécules en 3D avec doublets non-liants, géométrie VSEPR, charges partielles et barycentres
- 📖 **Librairie** : Accédez à des PDF et livres de sciences
- 👨‍💼 **Administration** : Ajoutez, modifiez et supprimez du contenu

## 🛠️ Technologies

- **Frontend** : React + TypeScript + Vite
- **Style** : Tailwind CSS
- **Base de données** : Supabase (PostgreSQL + Storage)
- **Hébergement** : GitHub Pages
- **Formules** : MathJax pour le rendu LaTeX
- **Molécules 3D** : 3Dmol.js pour la visualisation moléculaire

## 🚀 Déploiement

Voir le guide détaillé : [GITHUB_PAGES_SETUP.md](./GITHUB_PAGES_SETUP.md)

### Déploiement rapide

```bash
# 1. Configurer les secrets sur GitHub (voir GITHUB_PAGES_SETUP.md)

# 2. Pousser le code
git add .
git commit -m "Mise à jour"
git push origin main

# 3. Le site se met à jour automatiquement en 2-3 minutes !
```

## 📁 Structure du projet

```
physichem/
├── app/                          # Application React
│   ├── src/
│   │   ├── components/           # Composants UI (molécules 3D, etc.)
│   │   ├── sections/             # Pages (Home, Courses, Problems, etc.)
│   │   ├── hooks/                # Hooks personnalisés
│   │   ├── lib/                  # Utilitaires (Supabase, etc.)
│   │   └── types/                # Types TypeScript
│   ├── .env                      # Variables d'environnement (local)
│   └── vite.config.ts            # Configuration Vite
├── .github/
│   └── workflows/
│       └── deploy.yml            # Workflow GitHub Actions
├── GITHUB_PAGES_SETUP.md         # Guide de déploiement
└── SETUP.md                      # Guide d'installation
```

## ⚙️ Configuration Supabase

1. Créez un projet sur [Supabase](https://supabase.com)
2. Exécutez le script `SETUP_SUPABASE_COMPLETE.sql` dans l'éditeur SQL
3. Créez les buckets de stockage : `images`, `documents`, `covers`
4. Configurez les variables d'environnement dans `app/.env`

## 🧪 Développement local

```bash
# Installation des dépendances
cd app
npm install

# Lancer le serveur de développement
npm run dev

# Construire pour la production
npm run build
```

## 📝 License

MIT License - Libre d'utilisation et de modification.

---

Créé avec ❤️ pour les passionnés de chimie et physique.
