-- Harjoitustehtävien vastaukset — edistymisen seuranta ja kertausjono.
-- Aja Supabasessa (jaettu projekti fskuareieemuefgxrwed).

create table if not exists public.practice_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  subject_id text not null,
  question_id text not null,
  module text,
  correct boolean not null,
  chosen_index int,
  created_at timestamptz not null default now()
);

create index if not exists practice_attempts_email_subject_idx
  on public.practice_attempts (email, subject_id, created_at desc);
create index if not exists practice_attempts_question_idx
  on public.practice_attempts (email, question_id, created_at desc);

alter table public.practice_attempts enable row level security;

-- Ei julkista anon-käyttöä — vain service role API:n kautta.
