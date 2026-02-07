-- ============================================
-- CRÉATION MANUELLE DES BUCKETS - VERSION ALTERNATIVE
-- Si le précédent ne fonctionne pas, essayez celui-ci
-- ============================================

-- Activer l'extension UUID si pas déjà fait
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. CRÉER LES BUCKETS AVEC TOUTES LES COLONNES
-- ============================================

-- Supprimer et recréer le bucket 'images' proprement
DELETE FROM storage.buckets WHERE id = 'images';
DELETE FROM storage.buckets WHERE name = 'images';

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
  timezone('utc'::text, now()),
  timezone('utc'::text, now()),
  TRUE,
  FALSE,
  52428800,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
);

-- Supprimer et recréer le bucket 'documents' proprement
DELETE FROM storage.buckets WHERE id = 'documents';
DELETE FROM storage.buckets WHERE name = 'documents';

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
  timezone('utc'::text, now()),
  timezone('utc'::text, now()),
  TRUE,
  FALSE,
  52428800,
  ARRAY['application/pdf']
);

-- ============================================
-- 2. SUPPRIMER TOUTES LES POLICIES EXISTANTES
-- ============================================

DO $$
DECLARE
    pol RECORD;
BEGIN
    FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
    END LOOP;
END
$$;

-- ============================================
-- 3. CRÉER LES POLICIES POUR LES BUCKETS
-- ============================================

-- Permettre TOUT sur le bucket 'images'
CREATE POLICY "images_all"
ON storage.objects
FOR ALL
TO public, anon, authenticated
USING (bucket_id = 'images')
WITH CHECK (bucket_id = 'images');

-- Permettre TOUT sur le bucket 'documents'
CREATE POLICY "documents_all"
ON storage.objects
FOR ALL
TO public, anon, authenticated
USING (bucket_id = 'documents')
WITH CHECK (bucket_id = 'documents');

-- ============================================
-- 4. VÉRIFICATION FINALE
-- ============================================

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
