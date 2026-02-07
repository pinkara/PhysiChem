-- ============================================
-- SETUP FINAL SUPABASE - VERSION SIMPLIFIÉE
-- ============================================

-- 1. SUPPRIMER LES ANCIENS BUCKETS (pour repartir propre)
DELETE FROM storage.buckets WHERE id = 'images' OR name = 'images';
DELETE FROM storage.buckets WHERE id = 'documents' OR name = 'documents';

-- 2. CRÉER LE BUCKET IMAGES
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images', 
  TRUE,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
);

-- 3. CRÉER LE BUCKET DOCUMENTS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  TRUE,
  52428800,
  ARRAY['application/pdf']
);

-- 4. SUPPRIMER LES ANCIENNES POLICIES
DROP POLICY IF EXISTS "images_all" ON storage.objects;
DROP POLICY IF EXISTS "documents_all" ON storage.objects;

-- 5. CRÉER LES POLICIES (autoriser tout le monde)
CREATE POLICY "images_all"
ON storage.objects FOR ALL
TO public, anon, authenticated
USING (bucket_id = 'images');

CREATE POLICY "documents_all"
ON storage.objects FOR ALL
TO public, anon, authenticated
USING (bucket_id = 'documents');

-- Vérification
SELECT id, name, public FROM storage.buckets;
