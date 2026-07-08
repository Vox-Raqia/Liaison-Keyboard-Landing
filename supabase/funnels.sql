-- ============================================================================
-- Liaison Reply — Funnel Tables: Beta Waitlist, Vanguard Pre-Signups, Applications
-- Run in Supabase SQL Editor (project: qgamfmxentwrzgecfqgbs).
-- ============================================================================

-- 1. beta_waitlist -----------------------------------------------------------
create table if not exists public.beta_waitlist (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  created_at    timestamptz not null default now(),
  interest_note text
);

create index if not exists beta_waitlist_email_idx
  on public.beta_waitlist (email);

alter table public.beta_waitlist enable row level security;

drop policy if exists "beta_waitlist_anon_insert" on public.beta_waitlist;
create policy "beta_waitlist_anon_insert"
  on public.beta_waitlist
  for insert
  to anon
  with check (
    email is not null
    and length(email) <= 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and created_at >= now() - interval '5 minutes'
    and created_at <= now() + interval '5 minutes'
  );

-- 2. vanguard_presignups -----------------------------------------------------
create table if not exists public.vanguard_presignups (
  id         uuid primary key default gen_random_uuid(),
  email      text unique not null,
  name       text not null,
  reason     text,
  created_at timestamptz not null default now()
);

create index if not exists vanguard_presignups_email_idx
  on public.vanguard_presignups (email);

alter table public.vanguard_presignups enable row level security;

drop policy if exists "vanguard_presignups_anon_insert" on public.vanguard_presignups;
create policy "vanguard_presignups_anon_insert"
  on public.vanguard_presignups
  for insert
  to anon
  with check (
    email is not null
    and length(email) <= 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and name is not null
    and length(name) <= 200
    and created_at >= now() - interval '5 minutes'
    and created_at <= now() + interval '5 minutes'
  );

-- 3. vanguard_applications ---------------------------------------------------
create table if not exists public.vanguard_applications (
  id                     uuid primary key default gen_random_uuid(),
  email                  text not null,
  name                   text not null,
  background             text,
  communication_philosophy text,
  fit_reason             text,
  early_insight          text,
  created_at             timestamptz not null default now()
);

create index if not exists vanguard_applications_created_at_idx
  on public.vanguard_applications (created_at);

alter table public.vanguard_applications enable row level security;

drop policy if exists "vanguard_applications_anon_insert" on public.vanguard_applications;
create policy "vanguard_applications_anon_insert"
  on public.vanguard_applications
  for insert
  to anon
  with check (
    email is not null
    and length(email) <= 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and name is not null
    and length(name) <= 200
    and background is not null
    and communication_philosophy is not null
    and fit_reason is not null
    and early_insight is not null
    and created_at >= now() - interval '5 minutes'
    and created_at <= now() + interval '5 minutes'
  );
