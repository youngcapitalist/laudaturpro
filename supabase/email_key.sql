-- email_key: kanoninen avain (Gmail-pisteet/plus pois) — estää duplikaattidripit.
-- Aja SQL Editorissa tai: supabase db query --linked --file supabase/email_key.sql

alter table public.lead_drip_enrollments
  add column if not exists email_key text;

alter table public.marketing_stream_unsubscribes
  add column if not exists email_key text;

alter table public.laudatur_access
  add column if not exists email_key text;

create index if not exists lead_drip_enrollments_email_key_idx
  on public.lead_drip_enrollments (email_key);

create index if not exists laudatur_access_email_key_idx
  on public.laudatur_access (email_key);

create index if not exists marketing_stream_unsubscribes_email_key_idx
  on public.marketing_stream_unsubscribes (email_key);

-- Vanha unique (email, stream) → uusi (email_key, stream)
alter table public.lead_drip_enrollments
  drop constraint if exists lead_drip_enrollments_email_stream_key;

create unique index if not exists lead_drip_enrollments_email_key_stream_idx
  on public.lead_drip_enrollments (email_key, stream)
  where email_key is not null;

create unique index if not exists marketing_stream_unsubscribes_key_stream_idx
  on public.marketing_stream_unsubscribes (email_key, stream)
  where email_key is not null;
