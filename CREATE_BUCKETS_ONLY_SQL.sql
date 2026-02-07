-- ============================================
-- CRÉATION DES BUCKETS - UNIQUEMENT SQL
-- Pas besoin de l'interface !
-- ============================================
-- 1. Activer l'extension UUID (si pas déjà fait)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Créer le bucket 'images' (public = true pour accès direct)
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
  'images',                           -- id
  'images',                           -- name
  NULL,                               -- owner (NULL = public)
  NOW(),                              -- created_at
  NOW(),                              -- updated_at
  TRUE,                               -- public (accessible sans auth)
  FALSE,                              -- avif_autodetection
  52428800,                           -- file_size_limit (50MB)
  ARRAY[                              -- allowed_mime_types
    'image/jpeg', 
    'image/png', 
    'image/gif', 
    'image/webp', 
    'image/svg+xml'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  updated_at = NOW();

-- 3. Créer le bucket 'documents' (pour les PDFs)
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
  52428800,  -- 50MB
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = TRUE,
  updated_at = NOW();

-- 4. Supprimer les anciennes policies storage si elles existent
DROP POLICY IF EXISTS "allow_all_images" ON storage.objects;
DROP POLICY IF EXISTS "allow_all_documents" ON storage.objects;
DROP POLICY IF EXISTS "public_read_images" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_images" ON storage.objects;
DROP POLICY IF EXISTS "public_read_documents" ON storage.objects;
DROP POLICY IF EXISTS "public_insert_documents" ON storage.objects;

-- 5. Créer une policy pour permettre TOUT sur le bucket 'images'
CREATE POLICY "allow_all_images"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- 6. Créer une policy pour permettre TOUT sur le bucket 'documents'
CREATE POLICY "allow_all_documents"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- 7. Vérification
SELECT 
  b.id as bucket_name,
  b.public,
  b.file_size_limit,
  COUNT(p.policyname) as policy_count
FROM storage.buckets b
LEFT JOIN pg_policies p ON p.tablename = 'objects' AND p.schemaname = 'storage'
WHERE b.id IN ('images', 'documents')
GROUP BY b.id, b.public, b.file_size_limit;

SELECT '✅ Buckets créés avec succès !' as status;
