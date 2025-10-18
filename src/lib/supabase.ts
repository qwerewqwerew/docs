import { createClient } from '@supabase/supabase-js';

// 환경 변수가 없으면 기본값 사용 (개발용)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://oaphdhsynwdrtbcvbsbw.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hcGhkaHN5bndkcnRiY3Zic2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc4NDc2NTksImV4cCI6MjA3MzQyMzY1OX0.iY3ppC6g6DvOY0Sd4JB2aDTrFPpQSIk2tg5PnkDAWrM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
