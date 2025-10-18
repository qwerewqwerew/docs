import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.PUBLIC_SUPABASE_URL,
  process.env.PUBLIC_SUPABASE_ANON_KEY
);

async function testCrud() {
  console.log('🧪 CRUD 테스트 시작...\n');

  // CREATE - 게시글 생성
  console.log('1️⃣ CREATE - 게시글 생성');
  const { data: newPost, error: createError } = await supabase
    .from('posts')
    .insert({
      title: '첫 번째 게시글',
      content: '안녕하세요! 이것은 테스트 게시글입니다.',
      author: '테스트 사용자'
    })
    .select()
    .single();

  if (createError) {
    console.log('❌ 생성 실패:', createError.message);
    return;
  }
  console.log('✅ 생성 성공:', newPost.title);
  console.log('   ID:', newPost.id);

  // READ - 모든 게시글 조회
  console.log('\n2️⃣ READ - 모든 게시글 조회');
  const { data: allPosts, error: readError } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (readError) {
    console.log('❌ 조회 실패:', readError.message);
    return;
  }
  console.log('✅ 조회 성공:', allPosts.length, '개의 게시글');
  allPosts.forEach(post => {
    console.log(`   - ${post.title} (${post.author})`);
  });

  // UPDATE - 게시글 수정
  console.log('\n3️⃣ UPDATE - 게시글 수정');
  const { data: updatedPost, error: updateError } = await supabase
    .from('posts')
    .update({
      title: '수정된 첫 번째 게시글',
      content: '내용이 수정되었습니다!'
    })
    .eq('id', newPost.id)
    .select()
    .single();

  if (updateError) {
    console.log('❌ 수정 실패:', updateError.message);
    return;
  }
  console.log('✅ 수정 성공:', updatedPost.title);

  // CREATE - 댓글 추가
  console.log('\n4️⃣ CREATE - 댓글 추가');
  const { data: newComment, error: commentError } = await supabase
    .from('comments')
    .insert({
      post_id: newPost.id,
      content: '좋은 게시글이네요!',
      author: '댓글 작성자'
    })
    .select()
    .single();

  if (commentError) {
    console.log('❌ 댓글 생성 실패:', commentError.message);
    return;
  }
  console.log('✅ 댓글 생성 성공:', newComment.content);

  // READ - 게시글과 댓글 함께 조회
  console.log('\n5️⃣ READ - 게시글과 댓글 함께 조회');
  const { data: postWithComments, error: joinError } = await supabase
    .from('posts')
    .select(`
      *,
      comments (
        id,
        content,
        author,
        created_at
      )
    `)
    .eq('id', newPost.id)
    .single();

  if (joinError) {
    console.log('❌ 조인 조회 실패:', joinError.message);
    return;
  }
  console.log('✅ 조인 조회 성공');
  console.log('   게시글:', postWithComments.title);
  console.log('   댓글 수:', postWithComments.comments.length);
  postWithComments.comments.forEach(comment => {
    console.log(`   - ${comment.content} (${comment.author})`);
  });

  // DELETE - 댓글 삭제 (게시글 삭제 시 자동으로 삭제되는지 확인)
  console.log('\n6️⃣ DELETE - 게시글 삭제 (댓글도 자동 삭제)');
  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', newPost.id);

  if (deleteError) {
    console.log('❌ 삭제 실패:', deleteError.message);
    return;
  }
  console.log('✅ 삭제 성공');

  // 댓글도 삭제되었는지 확인
  const { data: deletedComments, error: checkCommentsError } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', newPost.id);

  console.log('   댓글도 자동 삭제됨:', deletedComments.length === 0 ? '✅' : '❌');

  console.log('\n🎉 모든 CRUD 테스트 완료!');
}

testCrud();
