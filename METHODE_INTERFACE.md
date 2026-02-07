# 🖱️ MÉTHODE INTERFACE - Obligatoire si SQL ne marche pas

## ⚠️ IMPORTANT

Si le SQL ne fonctionne pas (erreur RLS), vous DEVEZ utiliser l'interface graphique.

---

## Étape 1 : Ouvrir Storage

1. Allez sur https://app.supabase.com
2. Cliquez sur votre projet
3. Dans le menu de gauche, cliquez sur **"Storage"**

---

## Étape 2 : Créer le bucket "images"

Cliquez sur **"New bucket"** et remplissez :

```
Name: images
☑️ Public bucket (IMPORTANT : cocher cette case)
File size limit: 50 MB
```

Cliquez **"Create bucket"**

---

## Étape 3 : Ajouter les permissions

1. Cliquez sur le bucket **"images"** (le nom)
2. En haut, cliquez sur l'onglet **"Policies"**
3. Cliquez sur le bouton **"New policy"**
4. Sélectionnez **"For full custom access"** (template)
5. Cochez toutes les cases :
   - ☑️ SELECT (read)
   - ☑️ INSERT (create)  
   - ☑️ UPDATE
   - ☑️ DELETE
6. Cliquez **"Save policy"**

---

## Étape 4 : Créer le bucket "documents"

Refaites exactement la même chose pour le bucket `documents` :

1. **New bucket**
2. Name: `documents`
3. ☑️ **Public bucket** (cocher)
4. **Create bucket**
5. Cliquez sur `documents` → **Policies** → **New policy**
6. **For full custom access**
7. Cochez ☑️ SELECT, ☑️ INSERT, ☑️ UPDATE, ☑️ DELETE
8. **Save policy**

---

## Étape 5 : Vérifier

Dans **Storage**, vous devez voir :

| Name | Public | Size limit |
|------|--------|------------|
| documents | ✅ | 50 MB |
| images | ✅ | 50 MB |

Cliquez sur chaque bucket et vérifiez qu'il y a une policy "Allow all operations"

---

## ✅ C'est bon !

Rechargez votre app (F5) et essayez d'uploader une image.
