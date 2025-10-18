-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Posts policies
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
CREATE POLICY "posts_select_policy" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts FOR DELETE USING (true);

-- Comments policies
DROP POLICY IF EXISTS "comments_select_policy" ON comments;
CREATE POLICY "comments_select_policy" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
CREATE POLICY "comments_insert_policy" ON comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "comments_update_policy" ON comments;
CREATE POLICY "comments_update_policy" ON comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "comments_delete_policy" ON comments;
CREATE POLICY "comments_delete_policy" ON comments FOR DELETE USING (true);

-- Auto update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
