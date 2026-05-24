create table if not exists books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  google_books_id text not null,
  title text not null,
  author text not null default '',
  cover_url text,
  page_count integer,
  added_at timestamptz not null default now(),
  unique (user_id, google_books_id)
);

alter table books enable row level security;

create policy "Users can read own books"
  on books for select
  using (auth.uid() = user_id);

create policy "Users can insert own books"
  on books for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own books"
  on books for delete
  using (auth.uid() = user_id);

create policy "Users can update own books"
  on books for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table books add column if not exists status text not null default 'to_read'
  check (status in ('to_read', 'currently_reading', 'read'));
