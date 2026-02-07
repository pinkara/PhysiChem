-- ============================================
-- Fix : Ajouter la colonne 'level' manquante à la table formulas
-- ============================================

-- Ajouter la colonne level si elle n'existe pas
ALTER TABLE formulas 
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Term';

-- Mettre à jour les formules existantes pour avoir une valeur par défaut
UPDATE formulas 
SET level = 'Term' 
WHERE level IS NULL OR level = '';

-- Vérifier la structure de la table
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'formulas';
