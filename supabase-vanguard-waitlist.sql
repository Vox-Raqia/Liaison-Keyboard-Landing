-- ============================================================================
-- Liaison Reply — Founding Vanguard Waitlist
-- Run this in the Supabase SQL Editor (project: qgamfmxentwrzgecfqgbs).
-- Security: Row Level Security enabled. Anonymous web traffic may INSERT only.
-- No SELECT / UPDATE / DELETE policies exist, so the lead list cannot be read
-- or scraped by the public. The service_role key (server-side) bypasses RLS
-- for authorized admin/reporting.
-- ============================================================================

create table if not exists public.vanguard_waitlist (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  joined_at   timestamptz not null default now(),
  status      text not null default 'waiting'
);

-- Index for fast duplicate lookups / admin queries.
create index if not exists vanguard_waitlist_email_idx
  on public.vanguard_waitlist (email);

-- Defense-in-depth: enforce a sane email shape for ALL roles (incl. service_role).
-- Wrapped so the seed script is safe to re-run.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'vanguard_waitlist_email_format'
  ) then
    alter table public.vanguard_waitlist
      add constraint vanguard_waitlist_email_format
      check (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$');
  end if;
end $$;

-- Lock the table down.
alter table public.vanguard_waitlist enable row level security;

-- Anonymous visitors (the waitlist form) may only INSERT a pristine,
-- self-service entry: a valid email, forced status 'waiting', and a joined_at
-- that matches "now" (prevents forging status or timestamps).
drop policy if exists "vanguard_anon_insert" on public.vanguard_waitlist;
create policy "vanguard_anon_insert"
  on public.vanguard_waitlist
  for insert
  to anon
  with check (
    email is not null
    and length(email) <= 254
    and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
    and status = 'waiting'
    and joined_at >= now() - interval '5 minutes'
    and joined_at <= now() + interval '5 minutes'
  );

-- Intentionally NO select / update / delete policies for anon or authenticated.
-- The lead list is write-only from the public web.
