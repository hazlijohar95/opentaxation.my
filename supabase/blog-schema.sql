-- ============================================
-- BLOG SCHEMA FOR OPENTAXATION.MY
-- ============================================
-- Run this in your Supabase SQL Editor

-- ============================================
-- ENUMS
-- ============================================

-- Post status enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'published', 'scheduled', 'archived');
  END IF;
END$$;

-- ============================================
-- BLOG CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_ms TEXT NOT NULL,
  description_en TEXT,
  description_ms TEXT,
  color TEXT DEFAULT '#3b82f6',
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- BLOG TAGS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- BLOG AUTHORS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_authors (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT UNIQUE,
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  bio_en TEXT,
  bio_ms TEXT,
  avatar_url TEXT,
  twitter TEXT,
  linkedin TEXT,
  website TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add email column if table already exists without it
ALTER TABLE blog_authors ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- ============================================
-- BLOG POSTS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT NOT NULL,
  locale TEXT DEFAULT 'en' CHECK (locale IN ('en', 'ms')),
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  author_id UUID REFERENCES blog_authors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES blog_categories(id) ON DELETE SET NULL,
  status post_status DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  meta_title TEXT,
  meta_description TEXT,
  og_image_url TEXT,
  view_count INTEGER DEFAULT 0,
  reading_time_minutes INTEGER DEFAULT 1,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(slug, locale)
);

-- ============================================
-- BLOG POST TAGS (Junction Table)
-- ============================================
CREATE TABLE IF NOT EXISTS blog_post_tags (
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ============================================
-- BLOG COMMENTS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================
-- BLOG BOOKMARKS
-- ============================================
CREATE TABLE IF NOT EXISTS blog_bookmarks (
  user_id TEXT NOT NULL,
  post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, post_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_locale ON blog_posts(locale);
CREATE INDEX IF NOT EXISTS idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_blog_comments_post ON blog_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_blog_bookmarks_user ON blog_bookmarks(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_authors_updated_at ON blog_authors;
CREATE TRIGGER update_blog_authors_updated_at
  BEFORE UPDATE ON blog_authors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_comments_updated_at ON blog_comments;
CREATE TRIGGER update_blog_comments_updated_at
  BEFORE UPDATE ON blog_comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-set published_at
CREATE OR REPLACE FUNCTION set_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD IS NULL OR OLD.status != 'published') AND NEW.published_at IS NULL THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_blog_posts_published_at ON blog_posts;
CREATE TRIGGER set_blog_posts_published_at
  BEFORE INSERT OR UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION set_published_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_bookmarks ENABLE ROW LEVEL SECURITY;

-- Categories: Public read
DROP POLICY IF EXISTS "Anyone can read categories" ON blog_categories;
CREATE POLICY "Anyone can read categories" ON blog_categories FOR SELECT USING (true);

-- Tags: Public read
DROP POLICY IF EXISTS "Anyone can read tags" ON blog_tags;
CREATE POLICY "Anyone can read tags" ON blog_tags FOR SELECT USING (true);

-- Authors: Public read
DROP POLICY IF EXISTS "Anyone can read authors" ON blog_authors;
CREATE POLICY "Anyone can read authors" ON blog_authors FOR SELECT USING (true);

-- Authors can update their own record
DROP POLICY IF EXISTS "Authors can update own record" ON blog_authors;
CREATE POLICY "Authors can update own record" ON blog_authors FOR UPDATE
  USING (user_id = auth.jwt() ->> 'sub');

-- Posts: Public read published
DROP POLICY IF EXISTS "Anyone can read published posts" ON blog_posts;
CREATE POLICY "Anyone can read published posts" ON blog_posts FOR SELECT
  USING (status = 'published' AND published_at <= NOW());

-- Authors can read all posts (for admin)
DROP POLICY IF EXISTS "Authors can read all posts" ON blog_posts;
CREATE POLICY "Authors can read all posts" ON blog_posts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Authors can create posts
DROP POLICY IF EXISTS "Authors can create posts" ON blog_posts;
CREATE POLICY "Authors can create posts" ON blog_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Authors can update posts
DROP POLICY IF EXISTS "Authors can update posts" ON blog_posts;
CREATE POLICY "Authors can update posts" ON blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Authors can delete posts
DROP POLICY IF EXISTS "Authors can delete posts" ON blog_posts;
CREATE POLICY "Authors can delete posts" ON blog_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Post tags: Public read, authors manage
DROP POLICY IF EXISTS "Anyone can read post tags" ON blog_post_tags;
CREATE POLICY "Anyone can read post tags" ON blog_post_tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authors can manage post tags" ON blog_post_tags;
CREATE POLICY "Authors can manage post tags" ON blog_post_tags FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Comments: Public read approved
DROP POLICY IF EXISTS "Anyone can read approved comments" ON blog_comments;
CREATE POLICY "Anyone can read approved comments" ON blog_comments FOR SELECT
  USING (is_approved = true);

DROP POLICY IF EXISTS "Users can insert own comments" ON blog_comments;
CREATE POLICY "Users can insert own comments" ON blog_comments FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Users can update own comments" ON blog_comments;
CREATE POLICY "Users can update own comments" ON blog_comments FOR UPDATE
  USING (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Users can delete own comments" ON blog_comments;
CREATE POLICY "Users can delete own comments" ON blog_comments FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

-- Bookmarks: Users manage own
DROP POLICY IF EXISTS "Users can read own bookmarks" ON blog_bookmarks;
CREATE POLICY "Users can read own bookmarks" ON blog_bookmarks FOR SELECT
  USING (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Users can insert own bookmarks" ON blog_bookmarks;
CREATE POLICY "Users can insert own bookmarks" ON blog_bookmarks FOR INSERT
  WITH CHECK (auth.jwt() ->> 'sub' = user_id);

DROP POLICY IF EXISTS "Users can delete own bookmarks" ON blog_bookmarks;
CREATE POLICY "Users can delete own bookmarks" ON blog_bookmarks FOR DELETE
  USING (auth.jwt() ->> 'sub' = user_id);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
CREATE OR REPLACE FUNCTION increment_post_view(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts SET view_count = view_count + 1 WHERE slug = post_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION calculate_reading_time(content TEXT)
RETURNS INTEGER AS $$
DECLARE
  word_count INTEGER;
BEGIN
  word_count := array_length(regexp_split_to_array(regexp_replace(content, '<[^>]*>', '', 'g'), '\s+'), 1);
  RETURN GREATEST(1, CEIL(COALESCE(word_count, 0) / 200.0));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION update_reading_time()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reading_time_minutes := calculate_reading_time(NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_blog_posts_reading_time ON blog_posts;
CREATE TRIGGER set_blog_posts_reading_time
  BEFORE INSERT OR UPDATE OF content ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_reading_time();

-- ============================================
-- AUTO-LINK USER TO AUTHOR BY EMAIL
-- ============================================
CREATE OR REPLACE FUNCTION link_user_to_author()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE blog_authors
  SET user_id = NEW.id::TEXT
  WHERE email = NEW.email AND user_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_link_author ON auth.users;
CREATE TRIGGER on_auth_user_created_link_author
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION link_user_to_author();

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO blog_categories (slug, name_en, name_ms, description_en, description_ms, color, sort_order) VALUES
  ('tax-updates', 'Tax Updates', 'Kemas Kini Cukai', 'Latest changes to Malaysian tax laws', 'Perubahan terkini undang-undang cukai Malaysia', '#3b82f6', 1),
  ('guides', 'Guides', 'Panduan', 'Step-by-step guides for tax filing', 'Panduan langkah demi langkah untuk pemfailan cukai', '#10b981', 2),
  ('business', 'Business', 'Perniagaan', 'Tax tips for businesses', 'Tips cukai untuk perniagaan', '#8b5cf6', 3),
  ('personal-finance', 'Personal Finance', 'Kewangan Peribadi', 'Managing personal taxes', 'Mengurus cukai peribadi', '#f59e0b', 4),
  ('news', 'News', 'Berita', 'Tax-related news', 'Berita berkaitan cukai', '#ef4444', 5)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO blog_tags (slug, name) VALUES
  ('lhdn', 'LHDN'),
  ('income-tax', 'Income Tax'),
  ('sst', 'SST'),
  ('relief', 'Tax Relief'),
  ('deadline', 'Deadline'),
  ('tips', 'Tips')
ON CONFLICT (slug) DO NOTHING;

-- Admin author with your email
INSERT INTO blog_authors (email, slug, name, bio_en, bio_ms, is_active) VALUES
  ('hazli@hazlijohar.my', 'hazli', 'Hazli Johar', 'Founder of OpenTaxation.my', 'Pengasas OpenTaxation.my', true)
ON CONFLICT (slug) DO UPDATE SET email = 'hazli@hazlijohar.my';

-- ============================================
-- STORAGE BUCKET FOR BLOG IMAGES
-- ============================================
-- Run this separately or in Supabase Dashboard > Storage > New Bucket
-- Bucket name: blog-images
-- Public: Yes
--
-- Or run:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
--
-- Storage policies (run in SQL editor):
DO $$
BEGIN
  -- Create bucket if not exists
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('blog-images', 'blog-images', true)
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN OTHERS THEN
  -- Ignore if storage schema doesn't exist
  NULL;
END$$;

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authors can upload images" ON storage.objects;
CREATE POLICY "Authors can upload images" ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );

-- Allow public read
DROP POLICY IF EXISTS "Anyone can view blog images" ON storage.objects;
CREATE POLICY "Anyone can view blog images" ON storage.objects FOR SELECT
  USING (bucket_id = 'blog-images');

-- Allow authors to delete their uploads
DROP POLICY IF EXISTS "Authors can delete images" ON storage.objects;
CREATE POLICY "Authors can delete images" ON storage.objects FOR DELETE
  USING (
    bucket_id = 'blog-images' AND
    EXISTS (
      SELECT 1 FROM blog_authors
      WHERE blog_authors.user_id = auth.jwt() ->> 'sub'
      AND blog_authors.is_active = true
    )
  );
