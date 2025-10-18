-- 특정 사용자를 Admin으로 설정하는 SQL

-- 1. 자신의 이메일로 Admin 권한 부여
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';  -- 여기에 본인 이메일 입력

-- 2. 여러 관리자 설정 예시
-- UPDATE user_profiles
-- SET role = 'admin'
-- WHERE email IN ('admin1@example.com', 'admin2@example.com');

-- 3. 특정 사용자를 Author로 변경
-- UPDATE user_profiles
-- SET role = 'author'
-- WHERE email = 'user@example.com';

-- 4. 모든 사용자 역할 확인
SELECT id, email, role, created_at
FROM user_profiles
ORDER BY created_at DESC;
