-- AI-generoidut käsitekortit (käyttäjäkohtaiset, teoria-aineet).
create table if not exists custom_term_cards (
  id text primary key,
  email text not null,
  subject_id text not null,
  term text not null,
  definition_fi text not null,
  example text default '',
  theme text default 'AI-generoitu',
  options jsonb not null default '[]',
  correct_index int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists custom_term_cards_email_subject_idx
  on custom_term_cards (email, subject_id);
