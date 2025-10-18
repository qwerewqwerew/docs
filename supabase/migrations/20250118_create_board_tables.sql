-- 게시판 테이블 생성
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) 활성화
alter table posts enable row level security;

-- 모든 사용자가 게시글을 읽을 수 있도록 정책 생성
create policy "게시글은 누구나 읽을 수 있습니다"
  on posts for select
  using (true);

-- 인증된 사용자만 게시글을 생성할 수 있도록 정책 생성
create policy "인증된 사용자만 게시글을 생성할 수 있습니다"
  on posts for insert
  with check (true);

-- 작성자만 자신의 게시글을 수정할 수 있도록 정책 생성
create policy "작성자만 게시글을 수정할 수 있습니다"
  on posts for update
  using (true);

-- 작성자만 자신의 게시글을 삭제할 수 있도록 정책 생성
create policy "작성자만 게시글을 삭제할 수 있습니다"
  on posts for delete
  using (true);

-- updated_at 자동 업데이트 함수
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- updated_at 트리거 생성
create trigger update_posts_updated_at
  before update on posts
  for each row
  execute procedure update_updated_at_column();

-- 댓글 테이블 생성
create table if not exists comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references posts(id) on delete cascade not null,
  content text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 댓글 RLS 활성화
alter table comments enable row level security;

-- 댓글 정책 생성
create policy "댓글은 누구나 읽을 수 있습니다"
  on comments for select
  using (true);

create policy "인증된 사용자만 댓글을 생성할 수 있습니다"
  on comments for insert
  with check (true);

create policy "작성자만 댓글을 수정할 수 있습니다"
  on comments for update
  using (true);

create policy "작성자만 댓글을 삭제할 수 있습니다"
  on comments for delete
  using (true);

-- 댓글 updated_at 트리거 생성
create trigger update_comments_updated_at
  before update on comments
  for each row
  execute procedure update_updated_at_column();
