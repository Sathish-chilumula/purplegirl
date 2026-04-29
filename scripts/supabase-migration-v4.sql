-- 💜 PurpleGirl Database Migration V4 — Unified Schema

-- 1. Update categories table
ALTER TABLE categories ADD COLUMN IF NOT EXISTS tier INTEGER DEFAULT 1;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS icon_emoji TEXT;

-- 2. Seed all 18 categories
DELETE FROM categories; -- Clear old categories to match new tiered structure

INSERT INTO categories (name, slug, icon_emoji, tier, description) VALUES
-- TIER 1
('Relationships & Marriage', 'relationships-marriage', '💕', 1, 'abuse, in-laws, toxic partners'),
('Women\'s Health', 'womens-health', '🌸', 1, 'PCOS, periods, hormones, thyroid'),
('Mental Health & Emotions', 'mental-health-emotions', '🧘', 1, 'depression, anxiety, burnout'),
('Skin & Beauty', 'skin-beauty', '✨', 1, 'skincare, acne, dark spots, hair'),
('Family & Parenting', 'family-parenting', '🏠', 1, 'parents, in-laws, parenting'),
('Baby Care & Motherhood', 'baby-care-motherhood', '🤱', 1, 'newborn, feeding, sleep, growth'),

-- TIER 2
('Fashion & Style', 'fashion-style', '👗', 2, 'saree, outfit ideas, body type'),
('Career & Workplace', 'career-workplace', '💼', 2, 'salary, harassment, career break'),
('Pregnancy & Fertility', 'pregnancy-fertility', '🫄', 2, 'IVF, miscarriage, trimesters'),
('Weight & Fitness', 'weight-fitness', '🏃', 2, 'weight loss, belly fat, diets'),
('Food & Indian Cooking', 'food-indian-cooking', '🍛', 2, 'recipes, nutrition, healthy eating'),
('Legal Rights', 'legal-rights', '⚖️', 2, 'divorce law, property, DV act'),

-- TIER 3
('Sex & Intimacy', 'sex-intimacy', '🔒', 3, 'low desire, pain, communication'),
('Finance & Money', 'finance-money', '💰', 3, 'savings, investment, debt'),
('Hair Care', 'hair-care', '💇', 3, 'hair fall, oiling, growth'),
('Home & Household', 'home-household', '🏡', 3, 'cleaning, vastu, home tips'),
('Festivals & Traditions', 'festivals-traditions', '🪔', 3, 'karwa chauth, navratri, mehendi'),
('Self-Growth & Confidence', 'self-growth-confidence', '🌱', 3, 'self-worth, boundaries, identity');

-- 3. Create articles table (for auto-generated content)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  language TEXT DEFAULT 'en',
  content_json JSONB, -- steps, things_needed, faqs
  intro TEXT,
  expert_tip TEXT,
  related_article_slugs TEXT[],
  tags TEXT[],
  reading_time_mins INTEGER,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  questions_json JSONB,
  result_types_json JSONB,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. RLS for new tables
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read for published articles" ON articles FOR SELECT USING (is_published = true);
CREATE POLICY "Allow public read for published quizzes" ON quizzes FOR SELECT USING (is_published = true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_quizzes_slug ON quizzes(slug);
