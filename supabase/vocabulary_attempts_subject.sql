-- Lisää subject_id sanastoyrityksiin (englanti + ruotsi).
alter table public.vocabulary_attempts
  add column if not exists subject_id text not null default 'englanti';

create index if not exists vocabulary_attempts_subject_idx
  on public.vocabulary_attempts (email, subject_id, created_at desc);
