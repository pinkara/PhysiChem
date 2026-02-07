-- Ajouter les colonnes manquantes à la table courses
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS categorycolor VARCHAR(50) DEFAULT '#f0f9ff',
ADD COLUMN IF NOT EXISTS categorytextcolor VARCHAR(50) DEFAULT '#0284c7';

-- Vérifier que les colonnes existent
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'courses';
