-- Waitlist table + case-insensitive unique index.
-- Idempotent: safe to run more than once. Paste into the Supabase SQL editor.

create table if not exists public.waitlist (
  id         bigint generated always as identity primary key,
  email      text not null,
  created_at timestamptz not null default now()
);

-- Case-insensitive uniqueness: "A@B.com" and "a@b.com" collide.
-- (zod already trims + lowercases before insert; this is the DB-level guard
--  that also stops rapid double-submits.)
create unique index if not exists waitlist_email_lower_idx
  on public.waitlist (lower(email));

-- Optional hardening: enable Row Level Security. The server uses the SERVICE
-- ROLE key, which bypasses RLS, so server-side inserts/reads keep working while
-- the anon/public key has no access (no policies are defined).
alter table public.waitlist enable row level security;
