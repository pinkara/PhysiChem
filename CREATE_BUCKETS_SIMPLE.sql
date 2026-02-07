-- Copiez ce code dans Supabase SQL Editor et cliquez Run
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('images', 'images', true),
  ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- Permissions
CREATE POLICY "allow_all_images" ON storage.objects 
  FOR ALL USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');
  
CREATE POLICY "allow_all_documents" ON storage.objects 
  FOR ALL USING (bucket_id = 'documents') WITH CHECK (bucket_id = 'documents');

SELECT 'OK' as status;
