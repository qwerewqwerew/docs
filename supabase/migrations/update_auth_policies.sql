-- RLS 정책 업데이트: 인증된 사용자만 글쓰기 가능

-- Posts 테이블 정책 업데이트
DROP POLICY IF EXISTS "posts_select_policy" ON posts;
CREATE POLICY "posts_select_policy" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts
FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts
FOR DELETE
TO authenticated
USING (true);

-- Comments 테이블 정책 업데이트
DROP POLICY IF EXISTS "comments_select_policy" ON comments;
CREATE POLICY "comments_select_policy" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
CREATE POLICY "comments_insert_policy" ON comments
FOR INSERT
TO authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "comments_update_policy" ON comments;
CREATE POLICY "comments_update_policy" ON comments
FOR UPDATE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "comments_delete_policy" ON comments;
CREATE POLICY "comments_delete_policy" ON comments
FOR DELETE
TO authenticated
USING (true);
