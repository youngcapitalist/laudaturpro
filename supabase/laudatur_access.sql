-- LaudaturPro — erillinen pääsytaulu (sama Supabase-projekti, ei valintakoe profiles).
-- Aja Supabase SQL Editorissa tai: supabase db push

create table if not exists public.laudatur_access (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  product_id text not null,
  product_name text,
  price_eur integer,
  stripe_session_id text unique not null,
  stripe_customer_id text,
  access_until timestamptz,
  utm_source text,
  utm_medium text,
  created_at timestamptz not null default now()
);

create index if not exists laudatur_access_email_idx on public.laudatur_access (email);
create index if not exists laudatur_access_product_idx on public.laudatur_access (product_id);

alter table public.laudatur_access enable row level security;

-- Ei julkista lukuoikeutta — vain service role / edge functions
create policy "laudatur_access_service_only"
  on public.laudatur_access
  for all
  using (false)
  with check (false);

comment on table public.laudatur_access is 'LaudaturPro ostot ja kurssipääsy — erillään valintakoe profiles-taulusta';
