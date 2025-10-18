import pg from 'pg';

const { Client } = pg;

const client = new Client({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  user: 'postgres.oaphdhsynwdrtbcvbsbw',
  password: 'nwtAmiXJJY4oVeRJ',
  database: 'postgres',
  ssl: {
    rejectUnauthorized: false
  }
});

async function openAccess() {
  try {
    console.log('📝 임시로 접근 제한 해제 중...');
    await client.connect();
    console.log('✅ 연결 성공!\n');

    // user_id를 NULL 허용으로 변경
    console.log('1️⃣ user_id 컬럼 NULL 허용...');
    await client.query('ALTER TABLE posts ALTER COLUMN user_id DROP NOT NULL;');
    console.log('   ✅ 성공\n');

    // 기존 정책 삭제
    console.log('2️⃣ 기존 RLS 정책 삭제...');
    await client.query('DROP POLICY IF EXISTS "posts_insert_policy" ON posts;');
    await client.query('DROP POLICY IF EXISTS "posts_update_policy" ON posts;');
    await client.query('DROP POLICY IF EXISTS "posts_delete_policy" ON posts;');
    console.log('   ✅ 성공\n');

    // 임시 오픈 정책
    console.log('3️⃣ 임시 오픈 정책 생성...');
    await client.query(`
      CREATE POLICY "posts_insert_policy" ON posts
      FOR INSERT
      WITH CHECK (true);
    `);
    await client.query(`
      CREATE POLICY "posts_update_policy" ON posts
      FOR UPDATE
      USING (true);
    `);
    await client.query(`
      CREATE POLICY "posts_delete_policy" ON posts
      FOR DELETE
      USING (true);
    `);
    console.log('   ✅ 성공\n');

    console.log('✅ 완료! 이제 로그인 없이도 글 작성이 가능합니다.');
    console.log('\n⚠️  주의: 이것은 테스트용입니다.');
    console.log('    나중에 OAuth 설정 후 다시 권한을 설정해야 합니다.');

  } catch (error) {
    console.error('❌ 오류:', error.message);
  } finally {
    await client.end();
  }
}

openAccess();
