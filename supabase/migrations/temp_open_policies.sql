-- 임시 테스트용: 모두에게 권한 허용 (개발 중에만 사용)
-- 나중에 update_auth_policies.sql로 변경하세요

DROP POLICY IF EXISTS "posts_select_policy" ON posts;
CREATE POLICY "posts_select_policy" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "posts_insert_policy" ON posts;
CREATE POLICY "posts_insert_policy" ON posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "posts_update_policy" ON posts;
CREATE POLICY "posts_update_policy" ON posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "posts_delete_policy" ON posts;
CREATE POLICY "posts_delete_policy" ON posts FOR DELETE USING (true);

DROP POLICY IF EXISTS "comments_select_policy" ON comments;
CREATE POLICY "comments_select_policy" ON comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "comments_insert_policy" ON comments;
CREATE POLICY "comments_insert_policy" ON comments FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "comments_update_policy" ON comments;
CREATE POLICY "comments_update_policy" ON comments FOR UPDATE USING (true);

DROP POLICY IF EXISTS "comments_delete_policy" ON comments;
CREATE POLICY "comments_delete_policy" ON comments FOR DELETE USING (true);
