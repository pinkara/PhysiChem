-- ============================================
-- FIX: Ajouter la colonne imagecredits à problems
-- ============================================

-- Ajouter la colonne imagecredits si elle n'existe pas
ALTER TABLE problems 
ADD COLUMN IF NOT EXISTS imagecredits TEXT;

-- Vérification
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'problems' 
ORDER BY ordinal_position;

SELECT '✅ Colonne imagecredits ajoutée !' as status;
