import 'dotenv/config';

const SUPABASE_URL = process.env.PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function executeSql(sql) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_SERVICE_KEY,
      'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
    body: JSON.stringify({ query: sql })
  });

  return response;
}

async function createTables() {
  console.log('📦 Supabase에 테이블 생성 중...\n');

  const queries = [
    // posts 테이블
    `CREATE TABLE IF NOT EXISTS posts (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );`,

    // comments 테이블
    `CREATE TABLE IF NOT EXISTS comments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );`,

    // RLS 활성화
    `ALTER TABLE posts ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE comments ENABLE ROW LEVEL SECURITY;`,

    // 읽기 정책
    `DROP POLICY IF EXISTS "누구나 읽기 가능" ON posts;
     CREATE POLICY "누구나 읽기 가능" ON posts FOR SELECT USING (true);`,

    `DROP POLICY IF EXISTS "누구나 댓글 읽기 가능" ON comments;
     CREATE POLICY "누구나 댓글 읽기 가능" ON comments FOR SELECT USING (true);`,

    // 쓰기 정책
    `DROP POLICY IF EXISTS "누구나 쓰기 가능" ON posts;
     CREATE POLICY "누구나 쓰기 가능" ON posts FOR INSERT WITH CHECK (true);`,

    `DROP POLICY IF EXISTS "누구나 댓글 쓰기 가능" ON comments;
     CREATE POLICY "누구나 댓글 쓰기 가능" ON comments FOR INSERT WITH CHECK (true);`,

    // 수정 정책
    `DROP POLICY IF EXISTS "누구나 수정 가능" ON posts;
     CREATE POLICY "누구나 수정 가능" ON posts FOR UPDATE USING (true);`,

    `DROP POLICY IF EXISTS "누구나 댓글 수정 가능" ON comments;
     CREATE POLICY "누구나 댓글 수정 가능" ON comments FOR UPDATE USING (true);`,

    // 삭제 정책
    `DROP POLICY IF EXISTS "누구나 삭제 가능" ON posts;
     CREATE POLICY "누구나 삭제 가능" ON posts FOR DELETE USING (true);`,

    `DROP POLICY IF EXISTS "누구나 댓글 삭제 가능" ON comments;
     CREATE POLICY "누구나 댓글 삭제 가능" ON comments FOR DELETE USING (true);`,
  ];

  // Supabase REST API로 직접 실행할 수 없으므로 Supabase 클라이언트 사용
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  console.log('📋 수동으로 SQL을 실행해주세요:\n');
  console.log('1. Supabase 대시보드: https://supabase.com/dashboard');
  console.log('2. SQL Editor 선택');
  console.log('3. 아래 SQL 복사 & 실행\n');
  console.log('='.repeat(60));

  const fullSql = `
-- 게시판 테이블
CREATE TABLE IF NOT EXISTS posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 활성화
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 읽기 정책
DROP POLICY IF EXISTS "누구나 읽기 가능" ON posts;
CREATE POLICY "누구나 읽기 가능" ON posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "누구나 댓글 읽기 가능" ON comments;
CREATE POLICY "누구나 댓글 읽기 가능" ON comments FOR SELECT USING (true);

-- 쓰기 정책
DROP POLICY IF EXISTS "누구나 쓰기 가능" ON posts;
CREATE POLICY "누구나 쓰기 가능" ON posts FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "누구나 댓글 쓰기 가능" ON comments;
CREATE POLICY "누구나 댓글 쓰기 가능" ON comments FOR INSERT WITH CHECK (true);

-- 수정 정책
DROP POLICY IF EXISTS "누구나 수정 가능" ON posts;
CREATE POLICY "누구나 수정 가능" ON posts FOR UPDATE USING (true);

DROP POLICY IF EXISTS "누구나 댓글 수정 가능" ON comments;
CREATE POLICY "누구나 댓글 수정 가능" ON comments FOR UPDATE USING (true);

-- 삭제 정책
DROP POLICY IF EXISTS "누구나 삭제 가능" ON posts;
CREATE POLICY "누구나 삭제 가능" ON posts FOR DELETE USING (true);

DROP POLICY IF EXISTS "누구나 댓글 삭제 가능" ON comments;
CREATE POLICY "누구나 댓글 삭제 가능" ON comments FOR DELETE USING (true);
  `;

  console.log(fullSql);
  console.log('='.repeat(60));
  console.log('\n✅ 실행 후 테이블이 생성됩니다!');
}

createTables();
