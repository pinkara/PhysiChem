-- ============================================
-- Fix RLS Policies pour éviter l'erreur 406
-- ============================================

-- Pour la table formulas (où l'erreur se produit)
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent
DROP POLICY IF EXISTS "Allow public read formulas" ON formulas;
DROP POLICY IF EXISTS "Allow admin write formulas" ON formulas;
DROP POLICY IF EXISTS "Allow authenticated insert formulas" ON formulas;
DROP POLICY IF EXISTS "Allow authenticated update formulas" ON formulas;
DROP POLICY IF EXISTS "Allow authenticated delete formulas" ON formulas;

-- Policy de lecture publique
CREATE POLICY "Allow public read formulas" 
  ON formulas 
  FOR SELECT 
  USING (true);

-- Policy pour INSERT (admin/authentifié)
CREATE POLICY "Allow authenticated insert formulas" 
  ON formulas 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Policy pour UPDATE (admin/authentifié) - Important pour éviter le 406
CREATE POLICY "Allow authenticated update formulas" 
  ON formulas 
  FOR UPDATE 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);

-- Policy pour DELETE (admin/authentifié)
CREATE POLICY "Allow authenticated delete formulas" 
  ON formulas 
  FOR DELETE 
  TO authenticated 
  USING (true);

-- ============================================
-- Faire de même pour les autres tables
-- ============================================

-- COURSES
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated insert courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated update courses" ON courses;
DROP POLICY IF EXISTS "Allow authenticated delete courses" ON courses;

CREATE POLICY "Allow public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert courses" ON courses FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update courses" ON courses FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete courses" ON courses FOR DELETE TO authenticated USING (true);

-- PROBLEMS
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read problems" ON problems;
DROP POLICY IF EXISTS "Allow authenticated insert problems" ON problems;
DROP POLICY IF EXISTS "Allow authenticated update problems" ON problems;
DROP POLICY IF EXISTS "Allow authenticated delete problems" ON problems;

CREATE POLICY "Allow public read problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert problems" ON problems FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update problems" ON problems FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete problems" ON problems FOR DELETE TO authenticated USING (true);

-- BOOKS
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read books" ON books;
DROP POLICY IF EXISTS "Allow authenticated insert books" ON books;
DROP POLICY IF EXISTS "Allow authenticated update books" ON books;
DROP POLICY IF EXISTS "Allow authenticated delete books" ON books;

CREATE POLICY "Allow public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert books" ON books FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update books" ON books FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete books" ON books FOR DELETE TO authenticated USING (true);

-- Vérification
SELECT 'RLS Policies mises à jour avec succès !' as status;
