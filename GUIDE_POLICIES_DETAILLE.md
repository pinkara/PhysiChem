# 📋 GUIDE DÉTAILLÉ - Création des Policies

## ÉTAPE 1 : Aller dans Storage

1. Connectez-vous sur https://app.supabase.com
2. Cliquez sur votre projet
3. Dans le menu de gauche, cliquez sur **"Storage"**

---

## ÉTAPE 2 : Créer le bucket

### Cliquez sur "New bucket"

```
┌─────────────────────────────┐
│  Name: [ images          ]  │
│                             │
│  ☑️ Public bucket           │  ← COCHER CETTE CASE
│                             │
│  File size limit:           │
│  [ 50 ] MB                  │
│                             │
│  [ Create bucket ]          │
└─────────────────────────────┘
```

Cliquez **"Create bucket"**

---

## ÉTAPE 3 : Ouvrir les Policies

### Vous voyez la liste des buckets :

```
┌─────────────────────────────────────┐
│ Name      │ Public │ Size limit     │
├─────────────────────────────────────┤
│ images    │ ✅     │ 50 MB          │  ← Cliquez sur "images"
└─────────────────────────────────────┘
```

1. **Cliquez sur le nom "images"** (pas sur les 3 points)
2. En haut de la page, vous voyez 3 onglets :
   - **Files**
   - **Configuration**  
   - **Policies** ← CLIQUEZ ICI

---

## ÉTAPE 4 : Créer la Policy

### Cliquez sur "New policy"

Une fenêtre s'ouvre avec plusieurs templates :

```
┌──────────────────────────────────────────┐
│  Select a template to get started:       │
│                                          │
│  ⭕ For full custom access              │  ← CLIQUEZ ICI
│    Allow all operations...               │
│                                          │
│  ⭕ For public access to selected...    │
│                                          │
│  ⭕ For public access to all buckets    │
│                                          │
└──────────────────────────────────────────┘
```

**Cliquez sur "For full custom access"**

---

## ÉTAPE 5 : Configurer la Policy

### 📋 Explications des champs :

| Champ | Valeur | Explication |
|-------|--------|-------------|
| **Policy name** | `images_all` | Nom de la règle (mettez ce que vous voulez, ex: `images_all`) |
| **Target roles** | `anon, authenticated` | Qui peut utiliser le bucket. Laissez `anon, authenticated` (tout le monde) |
| **Allowed operation** | ☑️ ALL | Quelles actions sont autorisées |

---

### La page de création s'ouvre avec ces champs :

```
┌──────────────────────────────────────────┐
│  Policy name:                            │
│  [ images_all                        ]   │  ← ÉCRIVEZ ÇA
│                                          │
│  Allowed operation:                      │
│                                          │
│  ☐ SELECT (read)                         │
│  ☐ INSERT (create)                       │
│  ☐ UPDATE                                │
│  ☐ DELETE                                │
│  ☐ ALL                                   │
│                                          │
│  Target roles:                           │
│  [ anon, authenticated               ]   │  ← LAISSER ÇA
│                                          │
└──────────────────────────────────────────┘
```

### 📝 Policy name :
Écrivez : **`images_all`** (ou **`documents_all`** pour l'autre bucket)

### 👥 Target roles :
Laissez tel quel : **`anon, authenticated`**

> 💡 **Si ça ne marche pas**, essayez avec : **`public, anon, authenticated`** (ajoutez `public`)
> 
> Ou juste : **`public`**

### ✅ Cochez TOUT :

```
☑️ SELECT (read)         ← COCHER
☑️ INSERT (create)       ← COCHER  
☑️ UPDATE                ← COCHER
☑️ DELETE                ← COCHER
☑️ ALL                   ← COCHER (coche les 4 d'un coup)
```

### OU cliquez juste sur "ALL" (plus rapide)

---

## ÉTAPE 6 : Définir la condition

### Scrollez vers le bas, vous voyez :

```
┌──────────────────────────────────────────┐
│  USING expression:                       │
│  [ bucket_id = 'images'              ]   │
│                                          │
│  WITH CHECK expression:                  │
│  [ bucket_id = 'images'              ]   │
│                                          │
│  [  Review  ]   [  Save policy  ]        │
└──────────────────────────────────────────┘
```

**Vérifiez que ça dit bien :**
- `bucket_id = 'images'`

Puis cliquez **"Save policy"**

---

## ÉTAPE 7 : Vérifier

### Vous devez voir :

```
┌──────────────────────────────────────────┐
│  Policies for images                     │
│                                          │
│  ✅ images_all                           │
│     Allowed: ALL (SELECT, INSERT,        │
│              UPDATE, DELETE)             │
│     Target roles: public, anon...        │
│                                          │
│  [ + New policy ]                        │
└──────────────────────────────────────────┘
```

---

## ÉTAPE 8 : Refaire pour "documents"

1. Retournez dans **Storage** (menu gauche)
2. **New bucket**
3. Name: `documents`
4. ☑️ **Public bucket** (cocher)
5. **Create bucket**
6. Cliquez sur **"documents"**
7. Onglet **"Policies"**
8. **New policy**
9. **"For full custom access"**
10. Cochez ☑️ **ALL**
11. Vérifiez : `bucket_id = 'documents'`
12. **Save policy**

---

## ✅ VÉRIFICATION FINALE

Dans Storage, vous devez voir :

```
┌─────────────────────────────────────┐
│ Name       │ Public │ Size limit    │
├─────────────────────────────────────┤
│ documents  │ ✅ Yes │ 50 MB         │
│ images     │ ✅ Yes │ 50 MB         │
└─────────────────────────────────────┘
```

Et pour chaque bucket, dans l'onglet Policies :
- 1 policy nommée `images_all` ou `documents_all`
- Allowed : **ALL**

---

## 🚀 Testez !

Rechargez l'app (F5) et essayez d'ajouter un cours avec une image !
