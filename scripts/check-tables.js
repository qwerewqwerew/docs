import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  console.log('📦 Supabase에 테이블 생성 중...\n');

  try {
    // posts 테이블이 이미 있는지 확인
    const { data: existingTables, error: checkError } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (!checkError || checkError.code === 'PGRST116') {
      console.log('ℹ️  Supabase SQL Editor를 사용하여 테이블을 생성해야 합니다.\n');
      console.log('📋 다음 단계를 따라주세요:');
      console.log('1. Supabase 대시보드 접속: https://supabase.com/dashboard');
      console.log('2. 프로젝트 선택');
      console.log('3. 왼쪽 메뉴에서 "SQL Editor" 클릭');
      console.log('4. "+ New query" 클릭');
      console.log('5. supabase/migrations/20250118_create_board_tables.sql 파일 내용 복사');
      console.log('6. 붙여넣기 후 "Run" 클릭\n');

      console.log('✨ 또는 아래 명령어로 파일 내용을 확인하세요:');
      console.log('   cat supabase/migrations/20250118_create_board_tables.sql\n');
    } else {
      console.log('✅ 테이블이 이미 존재합니다!');
    }

  } catch (error) {
    console.error('❌ 오류:', error.message);
  }
}

createTables();
