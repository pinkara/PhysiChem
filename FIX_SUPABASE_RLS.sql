-- ============================================
-- FIX RLS (Row Level Security) - Permissions
-- ============================================
-- Exécutez ce code dans Supabase SQL Editor
-- ============================================

-- 1. Désactiver temporairement RLS pour toutes les tables
ALTER TABLE courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE problems DISABLE ROW LEVEL SECURITY;
ALTER TABLE formulas DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes policies
DROP POLICY IF EXISTS "Allow public read courses" ON courses;
DROP POLICY IF EXISTS "Allow public read problems" ON problems;
DROP POLICY IF EXISTS "Allow public read formulas" ON formulas;
DROP POLICY IF EXISTS "Allow public read books" ON books;
DROP POLICY IF EXISTS "Allow public insert courses" ON courses;
DROP POLICY IF EXISTS "Allow public insert problems" ON problems;
DROP POLICY IF EXISTS "Allow public insert formulas" ON formulas;
DROP POLICY IF EXISTS "Allow public insert books" ON books;
DROP POLICY IF EXISTS "Allow public update courses" ON courses;
DROP POLICY IF EXISTS "Allow public update problems" ON problems;
DROP POLICY IF EXISTS "Allow public update formulas" ON formulas;
DROP POLICY IF EXISTS "Allow public update books" ON books;
DROP POLICY IF EXISTS "Allow public delete courses" ON courses;
DROP POLICY IF EXISTS "Allow public delete problems" ON problems;
DROP POLICY IF EXISTS "Allow public delete formulas" ON formulas;
DROP POLICY IF EXISTS "Allow public delete books" ON books;

-- 3. Créer des policies qui autorisent tout (lecture + écriture) pour le développement
-- COURSES
CREATE POLICY "Allow all on courses" ON courses
  FOR ALL USING (true) WITH CHECK (true);

-- PROBLEMS  
CREATE POLICY "Allow all on problems" ON problems
  FOR ALL USING (true) WITH CHECK (true);

-- FORMULAS
CREATE POLICY "Allow all on formulas" ON formulas
  FOR ALL USING (true) WITH CHECK (true);

-- BOOKS
CREATE POLICY "Allow all on books" ON books
  FOR ALL USING (true) WITH CHECK (true);

-- 4. Réactiver RLS (optionnel - vous pouvez le garder désactivé)
-- Si vous voulez RLS activé avec les policies ci-dessus, décommentez les lignes suivantes :
-- ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- 5. Vérification
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('courses', 'problems', 'formulas', 'books');

SELECT 'RLS configuré avec succès !' as status;
