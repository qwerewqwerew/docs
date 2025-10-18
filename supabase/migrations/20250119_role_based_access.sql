-- 사용자 역할 관리 시스템 구축

-- 1. 사용자 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'author')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS 활성화
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 프로필 조회 가능
CREATE POLICY "user_profiles_select_policy" ON user_profiles
FOR SELECT
USING (true);

-- 자신의 프로필만 업데이트 가능
CREATE POLICY "user_profiles_update_policy" ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- 2. Posts 테이블에 user_id 추가
ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. Comments 테이블에 user_id 추가
ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 4. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;

DROP POLICY IF EXISTS "comments_select_policy" ON comments;
DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
DROP POLICY IF EXISTS "comments_update_policy" ON comments;
DROP POLICY IF EXISTS "comments_delete_policy" ON comments;

-- 5. Posts 새 RLS 정책 생성

-- 모두 조회 가능
CREATE POLICY "posts_select_policy" ON posts
FOR SELECT
USING (true);

-- 인증된 사용자만 작성 가능
CREATE POLICY "posts_insert_policy" ON posts
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin: 모든 글 수정, Author: 자신의 글만 수정
CREATE POLICY "posts_update_policy" ON posts
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND (user_profiles.role = 'admin' OR posts.user_id = auth.uid())
  )
);

-- Admin: 모든 글 삭제, Author: 자신의 글만 삭제
CREATE POLICY "posts_delete_policy" ON posts
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND (user_profiles.role = 'admin' OR posts.user_id = auth.uid())
  )
);

-- 6. Comments 새 RLS 정책 생성

-- 모두 조회 가능
CREATE POLICY "comments_select_policy" ON comments
FOR SELECT
USING (true);

-- 인증된 사용자만 댓글 작성 가능
CREATE POLICY "comments_insert_policy" ON comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admin: 모든 댓글 수정, Author: 자신의 댓글만 수정
CREATE POLICY "comments_update_policy" ON comments
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND (user_profiles.role = 'admin' OR comments.user_id = auth.uid())
  )
);

-- Admin: 모든 댓글 삭제, Author: 자신의 댓글만 삭제 또는 자신의 글의 댓글 삭제
CREATE POLICY "comments_delete_policy" ON comments
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.id = auth.uid()
    AND (
      user_profiles.role = 'admin'
      OR comments.user_id = auth.uid()
      OR EXISTS (
        SELECT 1 FROM posts
        WHERE posts.id = comments.post_id
        AND posts.user_id = auth.uid()
      )
    )
  )
);

-- 7. 신규 사용자 자동 프로필 생성 트리거
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'author');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- 8. 프로필 업데이트 타임스탬프 트리거
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
