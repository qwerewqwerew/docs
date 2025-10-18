# 🔐 Supabase OAuth 로그인 설정 가이드

## 문제: 로그인 버튼을 눌러도 아무 반응이 없거나 오류 발생

## 원인
Supabase에서 GitHub 또는 Google OAuth가 설정되지 않았습니다.

---

## ✅ 해결 방법

### 1단계: Supabase Dashboard 접속

1. https://supabase.com/dashboard 접속
2. 프로젝트 선택: **oaphdhsynwdrtbcvbsbw**
3. 왼쪽 메뉴에서 **Authentication** → **Providers** 클릭

---

### 2단계: GitHub OAuth 설정

#### A. Supabase에서 Callback URL 복사
1. **Providers** 페이지에서 **GitHub** 찾기
2. **Callback URL (for OAuth)** 복사
   ```
   https://oaphdhsynwdrtbcvbsbw.supabase.co/auth/v1/callback
   ```

#### B. GitHub OAuth App 생성
1. https://github.com/settings/developers 접속
2. **OAuth Apps** → **New OAuth App** 클릭
3. 다음 정보 입력:
   - **Application name**: `Docs Board` (원하는 이름)
   - **Homepage URL**: `http://localhost:4321`
   - **Authorization callback URL**: 위에서 복사한 Callback URL
   ```
   https://oaphdhsynwdrtbcvbsbw.supabase.co/auth/v1/callback
   ```
4. **Register application** 클릭

#### C. GitHub Credentials 복사
1. **Client ID** 복사
2. **Generate a new client secret** 클릭 → **Client Secret** 복사

#### D. Supabase에 GitHub 연동
1. Supabase Dashboard → **Authentication** → **Providers** → **GitHub**
2. **Enable Sign in with GitHub** 체크
3. **Client ID** 붙여넣기
4. **Client Secret** 붙여넣기
5. **Save** 클릭

---

### 3단계: Google OAuth 설정

#### A. Google Cloud Console 접속
1. https://console.cloud.google.com/ 접속
2. 프로젝트 선택 또는 새로 만들기

#### B. OAuth 동의 화면 설정
1. **APIs & Services** → **OAuth consent screen**
2. **External** 선택 → **Create**
3. 필수 정보 입력:
   - **App name**: `Docs Board`
   - **User support email**: 본인 이메일
   - **Developer contact information**: 본인 이메일
4. **Save and Continue** 반복해서 완료

#### C. OAuth Client ID 생성
1. **APIs & Services** → **Credentials**
2. **Create Credentials** → **OAuth client ID**
3. **Application type**: **Web application**
4. **Name**: `Docs Board`
5. **Authorized redirect URIs** 추가:
   ```
   https://oaphdhsynwdrtbcvbsbw.supabase.co/auth/v1/callback
   ```
6. **Create** 클릭
7. **Client ID**와 **Client secret** 복사

#### D. Supabase에 Google 연동
1. Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. **Enable Sign in with Google** 체크
3. **Client ID (for OAuth)** 붙여넣기
4. **Client Secret (for OAuth)** 붙여넣기
5. **Save** 클릭

---

### 4단계: Site URL 및 Redirect URLs 설정

1. Supabase Dashboard → **Authentication** → **URL Configuration**
2. **Site URL** 설정:
   ```
   http://localhost:4321
   ```
3. **Redirect URLs** 추가:
   ```
   http://localhost:4321/**
   http://localhost:4321/board/**
   ```
4. **Save** 클릭

---

## 🧪 테스트

### 1. 서버 재시작
```bash
npm run dev
```

### 2. 브라우저 접속
```
http://localhost:4321/board/
```

### 3. 로그인 테스트
- **GitHub 로그인** 버튼 클릭 → GitHub 인증 화면으로 이동
- **Google 로그인** 버튼 클릭 → Google 인증 화면으로 이동
- 인증 후 게시판으로 리다이렉트
- 우측 상단에 이메일과 로그아웃 버튼 표시

---

## ❌ 문제 해결

### 로그인 버튼 클릭 시 아무 반응 없음
- 브라우저 콘솔(F12) 확인
- OAuth Provider 설정 확인

### "Invalid OAuth state" 오류
- Redirect URLs 설정 확인
- Site URL 설정 확인

### "OAuth provider not enabled" 오류
- Supabase Dashboard에서 Provider Enable 체크 확인

### 로그인 후 404 페이지
- Redirect URL이 `/board/`로 올바르게 설정되었는지 확인

---

## 📋 체크리스트

- [ ] GitHub OAuth App 생성
- [ ] Supabase에 GitHub Client ID/Secret 등록
- [ ] Supabase에서 GitHub Provider 활성화
- [ ] Google Cloud OAuth Client 생성
- [ ] Supabase에 Google Client ID/Secret 등록
- [ ] Supabase에서 Google Provider 활성화
- [ ] Site URL 설정: `http://localhost:4321`
- [ ] Redirect URLs 설정: `http://localhost:4321/**`
- [ ] 서버 재시작
- [ ] 브라우저 테스트

---

## 🎉 완료 후

로그인이 정상 작동하면:
1. `20250119_role_based_access.sql` 실행
2. `set_admin_role.sql`에서 본인 이메일을 Admin으로 설정
3. 역할 기반 권한 시스템 작동 확인

---

## 💡 참고

- **개발 환경**: `http://localhost:4321`
- **프로덕션 배포 시**: Site URL과 Redirect URLs를 프로덕션 도메인으로 변경 필요
- **보안**: Client Secret은 절대 공개 저장소에 커밋하지 마세요
