-- 사용자 프로필 INSERT 정책 추가
-- 새 사용자가 프로필을 생성할 수 있도록 허용
CREATE POLICY "user_profiles_insert_policy" ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- 기존 사용자 프로필이 없는 경우를 위한 임시 정책 (개발용)
-- 프로덕션에서는 제거해야 함
CREATE POLICY "user_profiles_insert_any" ON user_profiles
FOR INSERT
WITH CHECK (true);
