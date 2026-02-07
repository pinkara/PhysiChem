-- ============================================-- NETTOYAGE DES IMAGES BLOB - À EXÉCUTER DANS SUPABASE-- ============================================

-- Mettre à jour tous les cours qui ont des images blob
UPDATE courses 
SET image = '' 
WHERE image LIKE 'blob:%' OR image LIKE 'data:%';

-- Mettre à jour tous les problèmes qui ont des images blob
UPDATE problems 
SET image = '' 
WHERE image LIKE 'blob:%' OR image LIKE 'data:%';

-- Mettre à jour tous les livres qui ont des pdf_url blob
UPDATE books 
SET pdf_url = '' 
WHERE pdf_url LIKE 'blob:%' OR pdf_url LIKE 'data:%';

-- Mettre à jour tous les livres qui ont des cover_image blob
UPDATE books 
SET cover_image = '' 
WHERE cover_image LIKE 'blob:%' OR cover_image LIKE 'data:%';

SELECT '✅ Images blob nettoyées !' as status;
