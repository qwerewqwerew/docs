// Supabase Auth 테스트 스크립트
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase Auth 설정 확인...\n');

console.log('✅ Supabase URL:', supabaseUrl);
console.log('✅ Anon Key:', supabaseAnonKey ? '설정됨 (' + supabaseAnonKey.substring(0, 20) + '...)' : '❌ 없음');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 현재 세션 확인
const checkSession = async () => {
  console.log('\n📋 현재 세션 확인...');
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error('❌ 세션 확인 실패:', error.message);
  } else if (session) {
    console.log('✅ 로그인 상태:', session.user.email);
  } else {
    console.log('ℹ️  로그인되지 않음');
  }
};

// OAuth 제공자 확인
const checkProviders = async () => {
  console.log('\n🔐 OAuth 제공자 확인...');
  console.log('Supabase Dashboard에서 확인 필요:');
  console.log('https://supabase.com/dashboard/project/oaphdhsynwdrtbcvbsbw/auth/providers');
  console.log('\n필요한 설정:');
  console.log('1. GitHub Provider 활성화');
  console.log('2. Google Provider 활성화');
  console.log('3. Site URL 설정: http://localhost:4321');
  console.log('4. Redirect URLs 설정: http://localhost:4321/board/');
};

checkSession();
checkProviders();
