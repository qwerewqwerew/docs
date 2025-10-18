import pg from 'pg';
import fs from 'fs';

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

async function runFix() {
  try {
    console.log('📝 데이터베이스 연결 중...');
    await client.connect();
    console.log('✅ 연결 성공!\n');

    const sqlFile = fs.readFileSync('./supabase/migrations/fix_403.sql', 'utf8');
    const statements = sqlFile
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      if (!stmt) continue;

      console.log(`${i + 1}/${statements.length} 실행 중...`);
      console.log(`   ${stmt.substring(0, 60)}...`);

      try {
        await client.query(stmt);
        console.log('   ✅ 성공\n');
      } catch (error) {
        if (error.message.includes('already exists') || error.message.includes('does not exist')) {
          console.log(`   ⚠️  ${error.message}\n`);
        } else {
          console.log(`   ❌ 오류: ${error.message}\n`);
        }
      }
    }

    console.log('✅ 모든 작업 완료!');
    console.log('\n이제 로그인 후 글 작성을 시도해보세요.');

  } catch (error) {
    console.error('❌ 데이터베이스 연결 실패:', error.message);
  } finally {
    await client.end();
  }
}

runFix();