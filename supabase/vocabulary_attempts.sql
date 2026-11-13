-- Englannin sanastoharjoittelun vastaukset — kertausjono ja edistyminen.
-- Aja Supabasessa (jaettu projekti fskuareieemuefgxrwed).

create table if not exists public.vocabulary_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  word_id text not null,
  mode text not null default 'card',
  correct boolean not null,
  created_at timestamptz not null default now()
);

create index if not exists vocabulary_attempts_email_idx
  on public.vocabulary_attempts (email, created_at desc);
create index if not exists vocabulary_attempts_word_idx
  on public.vocabulary_attempts (email, word_id, created_at desc);

alter table public.vocabulary_attempts enable row level security;
