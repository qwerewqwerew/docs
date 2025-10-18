# 역할 기반 권한 시스템 설정 가이드

## 📋 개요
게시판에 **Admin(관리자)**와 **Author(작성자)** 두 가지 역할을 구현했습니다.

### 권한 구분
- **Admin**: 모든 글/댓글 작성, 수정, 삭제 가능
- **Author**: 자신의 글/댓글만 작성, 수정, 삭제 가능 + 자신의 글에 달린 댓글 삭제 가능

## 🚀 설정 순서

### 1단계: 역할 시스템 구축
Supabase Dashboard → SQL Editor에서 실행:

```bash
supabase/migrations/20250119_role_based_access.sql
```

이 SQL은 다음을 수행합니다:
- `user_profiles` 테이블 생성 (사용자 역할 저장)
- `posts`, `comments` 테이블에 `user_id` 컬럼 추가
- 역할 기반 RLS 정책 적용
- 신규 사용자 자동 프로필 생성 (기본 역할: author)

### 2단계: 관리자 권한 부여
Supabase Dashboard → SQL Editor에서 실행:

```sql
-- 본인 이메일로 Admin 설정
UPDATE user_profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

**중요**: `'your-email@example.com'`을 GitHub/Google 로그인할 이메일로 변경하세요!

### 3단계: 테스트
1. **브라우저 새로고침**: http://localhost:4321/board/
2. **Admin 계정 로그인**: 모든 글의 수정/삭제 버튼이 보임
3. **Author 계정 로그인**: 자신의 글만 수정/삭제 버튼이 보임

## 🔍 확인 방법

### 사용자 역할 확인
```sql
SELECT id, email, role, created_at
FROM user_profiles
ORDER BY created_at DESC;
```

### RLS 정책 확인
```sql
-- Posts 정책
SELECT * FROM pg_policies WHERE tablename = 'posts';

-- Comments 정책
SELECT * FROM pg_policies WHERE tablename = 'comments';
```

## 📝 권한 상세

### Posts (게시글)
| 작업 | Admin | Author |
|------|-------|--------|
| 조회 | ✅ 모든 글 | ✅ 모든 글 |
| 작성 | ✅ | ✅ |
| 수정 | ✅ 모든 글 | ✅ 자신의 글만 |
| 삭제 | ✅ 모든 글 | ✅ 자신의 글만 |

### Comments (댓글)
| 작업 | Admin | Author |
|------|-------|--------|
| 조회 | ✅ 모든 댓글 | ✅ 모든 댓글 |
| 작성 | ✅ | ✅ |
| 수정 | ✅ 모든 댓글 | ✅ 자신의 댓글만 |
| 삭제 | ✅ 모든 댓글 | ✅ 자신의 댓글 + 자신의 글에 달린 댓글 |

## 🛠️ 추가 관리

### 역할 변경
```sql
-- Author로 변경
UPDATE user_profiles SET role = 'author' WHERE email = 'user@example.com';

-- Admin으로 변경
UPDATE user_profiles SET role = 'admin' WHERE email = 'admin@example.com';
```

### 여러 관리자 설정
```sql
UPDATE user_profiles
SET role = 'admin'
WHERE email IN ('admin1@example.com', 'admin2@example.com', 'admin3@example.com');
```

## ⚠️ 주의사항

1. **첫 로그인 후**: 자동으로 `user_profiles`에 등록됨 (기본 역할: author)
2. **역할 변경은 SQL로만 가능**: 보안을 위해 UI에서는 불가능
3. **기존 게시글**: `user_id`가 NULL일 수 있으니 데이터 정리 필요

### 기존 데이터 정리 (선택사항)
```sql
-- 기존 게시글 삭제 후 재시작 권장
DELETE FROM comments;
DELETE FROM posts;
```

## 🎉 완료!
이제 역할 기반 권한 시스템이 작동합니다!
- Admin: 모든 권한
- Author: 자신의 콘텐츠만 관리
