-- Lead drip -seuranta (jaettu Supabase-projekti).
-- Aja SQL Editorissa kerran.

create table if not exists public.lead_drip_enrollments (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  stream text not null,
  step_index int not null default 1,
  status text not null default 'active'
    check (status in ('active', 'completed', 'cancelled', 'converted')),
  payload jsonb not null default '{}'::jsonb,
  next_send_at timestamptz not null,
  last_sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (email, stream)
);

create index if not exists lead_drip_enrollments_due_idx
  on public.lead_drip_enrollments (next_send_at)
  where status = 'active';

create index if not exists lead_drip_enrollments_stream_idx
  on public.lead_drip_enrollments (stream);

-- Peruutus stream-kohtaisesti (ei vaikuta muihin kokeisiin).
create table if not exists public.marketing_stream_unsubscribes (
  email text not null,
  stream text not null,
  unsubscribed_at timestamptz not null default now(),
  primary key (email, stream)
);

alter table public.lead_drip_enrollments enable row level security;
alter table public.marketing_stream_unsubscribes enable row level security;

-- Vain service role (ei julkista lukua/kirjoitusta anon-kautta).
create policy "lead_drip_service_only"
  on public.lead_drip_enrollments for all using (false) with check (false);

create policy "marketing_stream_unsubscribes_service_only"
  on public.marketing_stream_unsubscribes for all using (false) with check (false);

comment on table public.lead_drip_enrollments is 'Automaattinen follow-up -jono per liidi ja stream (laudaturpro, valintakoe_f, …)';
comment on table public.marketing_stream_unsubscribes is 'Markkinointiperuutukset stream-kohtaisesti';
