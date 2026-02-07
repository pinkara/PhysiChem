-- ============================================-- Fix du schéma Supabase - Colonnes manquantes-- ============================================
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- ============================================-- 1. Table COURSES - Vérifier/Ajouter les colonnes manquantes-- ============================================

-- Ajouter les colonnes si elles n'existent pas
DO $$
BEGIN
    -- Colonne image
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'image') THEN
        ALTER TABLE courses ADD COLUMN image TEXT;
    END IF;
    
    -- Colonne image_credits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'image_credits') THEN
        ALTER TABLE courses ADD COLUMN image_credits TEXT;
    END IF;
    
    -- Colonne category_color
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'category_color') THEN
        ALTER TABLE courses ADD COLUMN category_color TEXT DEFAULT '#f0f9ff';
    END IF;
    
    -- Colonne category_text_color
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'category_text_color') THEN
        ALTER TABLE courses ADD COLUMN category_text_color TEXT DEFAULT '#0284c7';
    END IF;
    
    -- Colonne date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'date') THEN
        ALTER TABLE courses ADD COLUMN date TEXT;
    END IF;
    
    -- Colonne type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'courses' AND column_name = 'type') THEN
        ALTER TABLE courses ADD COLUMN type TEXT DEFAULT 'course';
    END IF;
END
$$;

-- ============================================-- 2. Table PROBLEMS - Ajouter les colonnes manquantes-- ============================================

DO $$
BEGIN
    -- Colonne image
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'problems' AND column_name = 'image') THEN
        ALTER TABLE problems ADD COLUMN image TEXT;
    END IF;
    
    -- Colonne image_credits
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'problems' AND column_name = 'image_credits') THEN
        ALTER TABLE problems ADD COLUMN image_credits TEXT;
    END IF;
    
    -- Colonne date
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'problems' AND column_name = 'date') THEN
        ALTER TABLE problems ADD COLUMN date TEXT;
    END IF;
    
    -- Colonne type
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'problems' AND column_name = 'type') THEN
        ALTER TABLE problems ADD COLUMN type TEXT DEFAULT 'problem';
    END IF;
END
$$;

-- ============================================-- 3. Table BOOKS - Renommer/Ajouter les colonnes-- ============================================

DO $$
BEGIN
    -- Renommer download_url vers pdf_url si nécessaire
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'books' AND column_name = 'download_url') THEN
        ALTER TABLE books RENAME COLUMN download_url TO pdf_url;
    END IF;
    
    -- Renommer cover_url vers cover_image si nécessaire  
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'books' AND column_name = 'cover_url') THEN
        ALTER TABLE books RENAME COLUMN cover_url TO cover_image;
    END IF;
    
    -- Ajouter upload_date si n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'books' AND column_name = 'upload_date') THEN
        ALTER TABLE books ADD COLUMN upload_date TEXT;
    END IF;
    
    -- Ajouter category si n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'books' AND column_name = 'category') THEN
        ALTER TABLE books ADD COLUMN category TEXT;
    END IF;
    
    -- Ajouter level si n'existe pas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'books' AND column_name = 'level') THEN
        ALTER TABLE books ADD COLUMN level TEXT DEFAULT 'Licence';
    END IF;
END
$$;

-- ============================================-- 4. Vérification-- ============================================

SELECT 'Colonnes de courses:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'courses' 
ORDER BY ordinal_position;

SELECT 'Colonnes de problems:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'problems' 
ORDER BY ordinal_position;

SELECT 'Colonnes de books:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'books' 
ORDER BY ordinal_position;

SELECT 'Schéma corrigé avec succès !' as status;
