-- ============================================
-- FIX STORAGE - Création des buckets
-- ============================================
-- Exécutez ce code dans Supabase SQL Editor
-- ============================================

-- 1. Créer le bucket 'images' s'il n'existe pas
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Créer le bucket 'documents' pour les PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Policy pour permettre l'upload public dans 'images'
CREATE POLICY "Allow public upload to images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'images');

-- 4. Policy pour permettre la lecture publique des images
CREATE POLICY "Allow public read images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');

-- 5. Policy pour permettre l'upload public dans 'documents'
CREATE POLICY "Allow public upload to documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');

-- 6. Policy pour permettre la lecture publique des documents
CREATE POLICY "Allow public read documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- 7. Vérification
SELECT name, public FROM storage.buckets;

SELECT 'Buckets créés avec succès !' as status;
