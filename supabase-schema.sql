-- DonutNV McDonough — database schema
-- Run this in your Supabase project: SQL Editor -> New query -> paste -> Run.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  location_name text not null,
  address text not null,
  date date not null,
  start_time time not null,
  end_time time not null,
  visibility text not null default 'public' check (visibility in ('public','private')),
  notes text,
  created_at timestamptz default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  level text not null default 'alert' check (level in ('info','alert')),
  active boolean not null default true,
  created_at timestamptz default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  event_date date,
  time_frame text,
  event_type text,
  servings text,
  venue text,
  heard_about text,
  message text,
  created_at timestamptz default now()
);

-- If the bookings table already existed, add the newer columns:
alter table bookings add column if not exists time_frame text;
alter table bookings add column if not exists servings text;
alter table bookings add column if not exists venue text;
alter table bookings add column if not exists heard_about text;

-- Row Level Security: allow the public to READ events/announcements,
-- and allow the public to INSERT a booking. All writes from the admin
-- dashboard use the service-role key (server-side) which bypasses RLS.
alter table events enable row level security;
alter table announcements enable row level security;
alter table bookings enable row level security;

create policy "public read events" on events for select using (true);
create policy "public read announcements" on announcements for select using (true);
create policy "public create bookings" on bookings for insert with check (true);

-- Helpful index for date-ordered schedule queries
create index if not exists events_date_idx on events (date, start_time);
