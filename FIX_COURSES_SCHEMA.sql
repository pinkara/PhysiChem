-- Script complet pour corriger le schéma de la table courses
-- Exécutez ce script dans Supabase SQL Editor

-- 1. Ajouter toutes les colonnes manquantes
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS image TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS imagecredits TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS categorycolor VARCHAR(50) DEFAULT '#f0f9ff',
ADD COLUMN IF NOT EXISTS categorytextcolor VARCHAR(50) DEFAULT '#0284c7';

-- 2. Vérifier la structure finale
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default 
FROM information_schema.columns 
WHERE table_name = 'courses'
ORDER BY ordinal_position;
