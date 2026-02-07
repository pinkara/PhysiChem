-- ============================================
-- SETUP COMPLET SUPABASE - TOUT EN UN
-- Exécutez ce code dans Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. CRÉER LES BUCKETS (si pas existants)
-- ============================================

-- Créer le bucket 'images'
INSERT INTO storage.buckets (
  id, 
  name, 
  owner, 
  created_at, 
  updated_at, 
  public, 
  avif_autodetection, 
  file_size_limit, 
  allowed_mime_types
)
VALUES (
  'images',
  'images',
  NULL,
  NOW(),
  NOW(),
  TRUE,
  FALSE,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

-- Créer le bucket 'documents'
INSERT INTO storage.buckets (
  id, 
  name, 
  owner, 
  created_at, 
  updated_at, 
  public, 
  avif_autodetection, 
  file_size_limit, 
  allowed_mime_types
)
VALUES (
  'documents',
  'documents',
  NULL,
  NOW(),
  NOW(),
  TRUE,
  FALSE,
  52428800,
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['application/pdf'];

-- ============================================
-- 2. SUPPRIMER LES ANCIENNES POLICIES STORAGE
-- ============================================

DROP POLICY IF EXISTS "allow_all_images" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_documents" ON storage.objects;
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_documents" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload to documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read documents" ON storage.objects;

-- ============================================
-- 3. CRÉER LES NOUVELLES POLICIES STORAGE
-- ============================================

-- Policy pour tout permettre sur 'images'
CREATE POLICY "allow_all_images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Policy pour tout permettre sur 'documents'
CREATE POLICY "allow_all_documents"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- ============================================
-- 4. VÉRIFICATION
-- ============================================

SELECT 
  'BUCKETS:' as section,
  id as name,
  public,
  file_size_limit / 1024 / 1024 as size_limit_mb
FROM storage.buckets
WHERE id IN ('images', 'documents');

SELECT 
  'POLICIES:' as section,
  policyname as name,
  tablename as table_name,
  permissive,
  roles::text as roles,
  cmd as command
FROM pg_policies
WHERE schemaname = 'storage' 
AND tablename = 'objects'
AND policyname IN ('allow_all_images', 'allow_all_documents');

SELECT '✅ Setup complet terminé !' as status;
