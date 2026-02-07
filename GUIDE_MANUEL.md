# 📖 GUIDE MANUEL - Création des Buckets Supabase

## Méthode 1 : Via l'interface (RECOMMANDÉE)

### Étape 1 : Aller dans Storage
1. Connectez-vous sur https://app.supabase.com
2. Cliquez sur votre projet
3. Dans le menu de gauche, cliquez sur **"Storage"**

### Étape 2 : Créer le bucket "images"
1. Cliquez sur le bouton **"New bucket"**
2. Remplissez :
   - **Name** : `images`
   - ☑️ **Public bucket** (COCHÉ)
   - **File size limit** : `50 MB`
3. Cliquez **"Create bucket"**

### Étape 3 : Ajouter les permissions au bucket "images"
1. Cliquez sur le bucket **"images"**
2. Cliquez sur l'onglet **"Policies"**
3. Cliquez sur **"New policy"**
4. Sélectionnez **"For full custom access"**
5. Cochez : ☑️ SELECT, ☑️ INSERT, ☑️ UPDATE, ☑️ DELETE
6. Cliquez **"Save policy"**

### Étape 4 : Créer le bucket "documents"
1. Retournez dans Storage
2. Cliquez **"New bucket"**
3. Remplissez :
   - **Name** : `documents`
   - ☑️ **Public bucket** (COCHÉ)
   - **File size limit** : `50 MB`
4. Cliquez **"Create bucket"**

### Étape 5 : Ajouter les permissions au bucket "documents"
1. Cliquez sur le bucket **"documents"**
2. Cliquez sur **"Policies"**
3. Cliquez **"New policy"**
4. Sélectionnez **"For full custom access"**
5. Cochez : ☑️ SELECT, ☑️ INSERT, ☑️ UPDATE, ☑️ DELETE
6. Cliquez **"Save policy"**

---

## Méthode 2 : Via SQL

1. Allez dans **"SQL Editor"** (menu gauche)
2. Cliquez **"New query"**
3. Copiez-collez le contenu du fichier **SETUP_FINAL.sql**
4. Cliquez **"Run"**

---

## ✅ Vérification

Dans le SQL Editor, exécutez :
```sql
SELECT id, name, public FROM storage.buckets;
```

Vous devriez voir :
| id | name | public |
|---|---|---|
| images | images | true |
| documents | documents | true |

Si c'est bon, rechargez l'app et les uploads fonctionneront ! 🎉
