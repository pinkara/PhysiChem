-- ============================================
-- MIGRATION: Ajout de la colonne variables à la table formulas
-- ============================================

-- Ajouter la colonne variables (type JSONB pour stocker un tableau d'objets)
ALTER TABLE formulas 
ADD COLUMN IF NOT EXISTS variables JSONB DEFAULT '[]'::jsonb;

-- Mettre à jour les formules existantes pour avoir un tableau vide par défaut
UPDATE formulas 
SET variables = '[]'::jsonb 
WHERE variables IS NULL;

-- ============================================
-- VÉRIFICATION
-- ============================================
-- Vérifier que la colonne a été ajoutée
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'formulas';
