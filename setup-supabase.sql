-- ============================================
-- PhysChim - Script SQL de configuration
-- À exécuter dans Supabase SQL Editor
-- ============================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. Création des tables
-- ============================================

-- Table des cours
CREATE TABLE IF NOT EXISTS courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  category_color TEXT DEFAULT '#f0f9ff',
  category_text_color TEXT DEFAULT '#0284c7',
  image TEXT,
  image_credits TEXT,
  code_example TEXT,
  code_language TEXT,
  date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des problèmes
CREATE TABLE IF NOT EXISTS problems (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'medium',
  hints JSONB DEFAULT '[]'::jsonb,
  solution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des formules
CREATE TABLE IF NOT EXISTS formulas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  tex TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT DEFAULT 'Term',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des livres
CREATE TABLE IF NOT EXISTS books (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  description TEXT,
  download_url TEXT NOT NULL,
  cover_url TEXT,
  file_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table des likes
CREATE TABLE IF NOT EXISTS likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  item_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(item_id, item_type)
);

-- Table des stats mensuelles
CREATE TABLE IF NOT EXISTS stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  month TEXT UNIQUE NOT NULL,
  visits INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- 2. Activation RLS (Row Level Security)
-- ============================================

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE formulas ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

-- Supprimer les anciennes policies si elles existent (pour éviter les conflits)
DROP POLICY IF EXISTS "Allow public read courses" ON courses;
DROP POLICY IF EXISTS "Allow public read problems" ON problems;
DROP POLICY IF EXISTS "Allow public read formulas" ON formulas;
DROP POLICY IF EXISTS "Allow public read books" ON books;
DROP POLICY IF EXISTS "Allow public read likes" ON likes;
DROP POLICY IF EXISTS "Allow public read stats" ON stats;
DROP POLICY IF EXISTS "Allow admin write courses" ON courses;
DROP POLICY IF EXISTS "Allow admin write problems" ON problems;
DROP POLICY IF EXISTS "Allow admin write formulas" ON formulas;
DROP POLICY IF EXISTS "Allow admin write books" ON books;
DROP POLICY IF EXISTS "Allow public insert likes" ON likes;
DROP POLICY IF EXISTS "Allow public write stats" ON stats;

-- ============================================
-- 3. Création des policies
-- ============================================

-- Policies de lecture publique
CREATE POLICY "Allow public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Allow public read problems" ON problems FOR SELECT USING (true);
CREATE POLICY "Allow public read formulas" ON formulas FOR SELECT USING (true);
CREATE POLICY "Allow public read books" ON books FOR SELECT USING (true);
CREATE POLICY "Allow public read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Allow public read stats" ON stats FOR SELECT USING (true);

-- Policies d'écriture (nécessite authentification pour admin)
CREATE POLICY "Allow admin write courses" ON courses FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write problems" ON problems FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write formulas" ON formulas FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin write books" ON books FOR ALL USING (auth.role() = 'authenticated');

-- Likes : insertion publique
CREATE POLICY "Allow public insert likes" ON likes FOR INSERT WITH CHECK (true);

-- Stats : écriture publique
CREATE POLICY "Allow public write stats" ON stats FOR ALL USING (true);

-- ============================================
-- 4. Données de test (optionnel)
-- ============================================

-- Cours exemple
INSERT INTO courses (title, description, content, category, level, category_color, category_text_color) VALUES
('La structure de l''atome', 'Découvrez les constituants de l''atome : protons, neutrons et électrons.', '<h2>Structure de l''atome</h2><p>L''atome est constitué d''un <strong>noyau</strong> (protons et neutrons) et d''<strong>électrons</strong> qui orbitent autour.</p>', 'Chimie', '2nde', '#fef3c7', '#d97706'),
('Les gaz parfaits', 'Étude des lois des gaz et l''équation d''état PV=nRT.', '<h2>Les gaz parfaits</h2><p>La loi de Boyle-Mariotte établit une relation entre la pression et le volume d''un gaz.</p>', 'Physique', '1re', '#dbeafe', '#2563eb'),
('Réactions acide-base', 'Comprendre les réactions d''acides et de bases selon Brønsted.', '<h2>Réactions acide-base</h2><p>Un acide est une espèce chimique capable de céder un proton H⁺.</p>', 'Chimie', 'Term', '#fce7f3', '#db2777')
ON CONFLICT DO NOTHING;

-- Formules exemple
INSERT INTO formulas (name, code, tex, category, description) VALUES
('Équation des gaz parfaits', 'PVNRT', 'PV = nRT', 'Thermodynamique', 'Relation entre pression, volume et température d''un gaz parfait'),
('Énergie cinétique', 'EC', 'E_c = \\frac{1}{2}mv^2', 'Mécanique', 'Énergie due au mouvement d''un objet'),
('Quantité de matière', 'N', 'n = \\frac{m}{M}', 'Chimie', 'Relation entre masse, masse molaire et quantité de matière'),
('pH d''une solution', 'PH', 'pH = -\\log_{10}([H_3O^+])', 'Chimie', 'Définition du pH d''une solution aqueuse')
ON CONFLICT (code) DO NOTHING;

-- Livre exemple
INSERT INTO books (title, author, description, download_url, cover_url, file_type) VALUES
('Physique-Chimie 2nde', 'Hachette Éducation', 'Manuel de physique-chimie pour la classe de seconde.', 'https://example.com/book.pdf', 'https://example.com/cover.jpg', 'pdf')
ON CONFLICT DO NOTHING;

-- Stats initiales
INSERT INTO stats (month, visits, likes) VALUES
(to_char(now(), 'YYYY-MM'), 0, 0)
ON CONFLICT (month) DO NOTHING;

-- ============================================
-- 5. Vérification
-- ============================================

SELECT 'Tables créées avec succès !' as status;
SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('courses', 'problems', 'formulas', 'books', 'likes', 'stats');
