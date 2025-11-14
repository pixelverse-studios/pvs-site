-- Audit Requests Table
-- Run inside the Supabase SQL editor or migration workflow.

-- 1. Ensure uuid generation helpers exist.
create extension if not exists "uuid-ossp";

-- 2. Enum for status lifecycle.
do $$
begin
  if not exists (select 1 from pg_type where typname = 'audit_request_status') then
    create type public.audit_request_status as enum ('pending', 'in_review', 'completed');
  end if;
end
$$;

-- 3. Table definition.
create table if not exists public.audit_requests (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  website_url text not null,
  phone_number text,
  specifics text,
  acknowledged boolean not null default false,
  status public.audit_request_status not null default 'pending',
  source text not null default 'website',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table if exists public.audit_requests
  add column if not exists acknowledged boolean not null default false;

-- 4. Helpful indexes.
create index if not exists audit_requests_status_idx on public.audit_requests (status);
create index if not exists audit_requests_created_at_idx on public.audit_requests (created_at desc);

-- 5. Updated-at trigger (requires the common helper function).
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists audit_requests_set_updated_at on public.audit_requests;
create trigger audit_requests_set_updated_at
before update on public.audit_requests
for each row
execute procedure public.set_updated_at();
