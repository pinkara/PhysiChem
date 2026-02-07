-- ============================================
-- FIX URGENT - Colonnes manquantes Supabase
-- ============================================
-- Copiez ce code et exécutez-le dans Supabase SQL Editor
-- ============================================

-- 1. Ajouter les colonnes manquantes à la table COURSES
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'course',
ADD COLUMN IF NOT EXISTS date TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS image_credits TEXT,
ADD COLUMN IF NOT EXISTS category_color TEXT DEFAULT '#f0f9ff',
ADD COLUMN IF NOT EXISTS category_text_color TEXT DEFAULT '#0284c7';

-- 2. Ajouter les colonnes manquantes à la table PROBLEMS  
ALTER TABLE problems
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'problem',
ADD COLUMN IF NOT EXISTS date TEXT,
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS image_credits TEXT;

-- 3. Ajouter les colonnes manquantes à la table BOOKS
ALTER TABLE books
ADD COLUMN IF NOT EXISTS upload_date TEXT,
ADD COLUMN IF NOT EXISTS pdf_url TEXT,
ADD COLUMN IF NOT EXISTS cover_image TEXT,
ADD COLUMN IF NOT EXISTS category TEXT,
ADD COLUMN IF NOT EXISTS level TEXT DEFAULT 'Licence';

-- 4. Vérification
SELECT 'COURSES:' as table_name, column_name 
FROM information_schema.columns 
WHERE table_name = 'courses' 
UNION ALL
SELECT 'PROBLEMS:' as table_name, column_name 
FROM information_schema.columns 
WHERE table_name = 'problems'
UNION ALL
SELECT 'BOOKS:' as table_name, column_name 
FROM information_schema.columns 
WHERE table_name = 'books'
ORDER BY table_name, column_name;
