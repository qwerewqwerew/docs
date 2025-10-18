-- 403 오류 해결: user_id 컬럼 추가 및 RLS 정책 수정

ALTER TABLE posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);
ALTER TABLE comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
DROP POLICY IF EXISTS "posts_update_policy" ON posts;
DROP POLICY IF EXISTS "posts_delete_policy" ON posts;

CREATE POLICY "posts_insert_policy" ON posts 
FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "posts_update_policy" ON posts 
FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "posts_delete_policy" ON posts 
FOR DELETE TO authenticated 
USING (auth.uid() = user_id);
