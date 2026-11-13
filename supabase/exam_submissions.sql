-- Harkkakoe-vastaukset — opiskelijan lähetys + opettajan arviointi.
-- Aja Supabasessa (jaettu projekti fskuareieemuefgxrwed).

create table if not exists public.exam_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  email text not null,
  subject_id text not null,
  task_id text not null,
  task_title text not null,
  task_type text not null,
  max_points int not null,
  answer_text text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed')),
  score int,
  admin_comment text,
  reviewed_at timestamptz,
  reviewed_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists exam_submissions_status_idx on public.exam_submissions (status, created_at desc);
create index if not exists exam_submissions_email_task_idx on public.exam_submissions (email, subject_id, task_id);

alter table public.exam_submissions enable row level security;

-- Ei julkista anon-käyttöä — vain service role API:n kautta.
