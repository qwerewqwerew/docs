import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function testConnection() {
  console.log('🔌 Supabase 연결 테스트...\n');

  // 테이블이 있는지 확인
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .limit(1);

  if (error) {
    if (error.code === '42P01') {
      console.log('❌ posts 테이블이 없습니다.');
      console.log('\n📋 테이블을 생성하려면:');
      console.log('1. https://supabase.com/dashboard/project/oaphdhsynwdrtbcvbsbw/sql/new');
      console.log('2. supabase/migrations/create_tables.sql 파일 내용 복사');
      console.log('3. 실행\n');
    } else {
      console.log('❌ 에러:', error.message);
    }
  } else {
    console.log('✅ posts 테이블이 존재합니다!');
    console.log('📊 데이터:', posts);
  }
}

testConnection();
