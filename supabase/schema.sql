-- BACK2U starter schema for Supabase PostgreSQL.
-- Review and apply in a development project first. Do not expose service-role keys in the browser.
create extension if not exists pgcrypto;

do $$ begin
  create type public.item_kind as enum ('lost', 'found');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.review_status as enum ('pending', 'approved', 'rejected', 'reunited');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'student' check (role in ('student', 'moderator', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.items (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  kind public.item_kind not null,
  title text not null,
  category text not null,
  description text not null,
  location text,
  happened_at timestamptz,
  image_path text,
  status public.review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sensitive clues are deliberately separated from public item listings.
create table if not exists public.item_private_details (
  item_id uuid primary key references public.items(id) on delete cascade,
  secret_clue text,
  contact_details text,
  verification_questions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  item_id uuid not null references public.items(id) on delete cascade,
  claimant_id uuid not null references auth.users(id) on delete cascade,
  claimant_answers jsonb not null default '[]'::jsonb,
  claimant_proof text,
  status text not null default 'pending' check (status in ('pending', 'needs_info', 'approved', 'rejected', 'completed')),
  moderator_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.items enable row level security;
alter table public.item_private_details enable row level security;
alter table public.claims enable row level security;

-- Signed-in users can read approved public listings. Owners can read their own reports.
drop policy if exists "Approved items are visible to everyone" on public.items;
create policy "Approved items are visible to everyone" on public.items for select
  using (status = 'approved' or reporter_id = auth.uid());
drop policy if exists "Users create their own reports" on public.items;
create policy "Users create their own reports" on public.items for insert
  with check (reporter_id = auth.uid());
drop policy if exists "Owners update their own pending reports" on public.items;
create policy "Owners update their own pending reports" on public.items for update
  using (reporter_id = auth.uid() and status = 'pending')
  with check (reporter_id = auth.uid());

-- Supabase Auth handles email format checks and email ownership verification.
-- BACK2U accepts any valid email address; no college-domain trigger is required.

-- Profile visibility is restricted to the authenticated account itself by default.
drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select using (id = auth.uid());
drop policy if exists "Users insert own profile" on public.profiles;
create policy "Users insert own profile" on public.profiles for insert with check (id = auth.uid());
-- Do not allow clients to update their own profile role. Profile role changes must be
-- performed by a trusted administrator/server-side function.

drop policy if exists "Users read own claims" on public.claims;
create policy "Users read own claims" on public.claims for select using (claimant_id = auth.uid());
drop policy if exists "Users submit claims as themselves" on public.claims;
create policy "Users submit claims as themselves" on public.claims for insert with check (claimant_id = auth.uid());

-- Reporters may add private details to their own item, but cannot read them back via
-- the normal browser client. Moderator review needs a trusted server-side function
-- with an explicit role check. Do not add a broad read policy to private details.
drop policy if exists "Reporters add private details to own items" on public.item_private_details;
create policy "Reporters add private details to own items" on public.item_private_details for insert
  with check (exists (select 1 from public.items i where i.id = item_id and i.reporter_id = auth.uid()));
