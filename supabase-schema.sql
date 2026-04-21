-- 💜 PurpleGirl Database Schema for Supabase

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  question_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  slug TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id),
  status TEXT DEFAULT 'pending',
  is_anonymous BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  metoo_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_seeded BOOLEAN DEFAULT false,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create answers table
CREATE TABLE IF NOT EXISTS answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  summary TEXT,
  detailed TEXT,
  bullet_points JSONB,
  faqs JSONB,
  disclaimer TEXT,
  affiliate_links JSONB,
  ai_model TEXT,
  is_edited BOOLEAN DEFAULT false,
  edited_by TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active',
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Seed categories
INSERT INTO categories (name, slug, icon, color) 
VALUES
('Beauty & Skincare',   'beauty-skincare',  '✨', '#E91E8C'),
('Relationships',       'relationships',    '💜', '#9C27B0'),
('Career & Money',      'career-money',     '💼', '#673AB7'),
('Health Basics',       'health-basics',    '🌿', '#4CAF50'),
('Fashion',             'fashion',          '👗', '#FF4081'),
('Mental Wellness',     'mental-wellness',  '🧘', '#7C4DFF'),
('Food & Nutrition',    'food-nutrition',   '🥗', '#FF9800')
ON CONFLICT (slug) DO NOTHING;

-- 6. Basic RLS (Row Level Security)
-- Note: You should refine these in Supabase Dashboard
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read-only access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to approved questions" ON questions FOR SELECT USING (status = 'approved' OR status = 'featured');
CREATE POLICY "Allow anyone to insert questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anyone to read answers" ON answers FOR SELECT USING (true);
CREATE POLICY "Allow anyone to subscribe" ON subscribers FOR INSERT WITH CHECK (true);
