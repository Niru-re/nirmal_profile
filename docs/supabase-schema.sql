-- ============================================================
--  NIRMAAN PORTFOLIO — Supabase Schema
--  Run this in your Supabase SQL Editor to create all tables.
-- ============================================================

-- ----------------------------------------------------------------
-- PROJECTS
-- ----------------------------------------------------------------
create table if not exists projects (
  id            bigint generated always as identity primary key,
  slug          text        not null unique,
  title         text        not null,
  description   text        not null default '',
  long_description text     not null default '',
  category      text        not null,
  featured      boolean     not null default false,
  cover_image   text        not null default '',
  demo_video    text,
  screenshots   text[]      not null default '{}',
  features      text[]      not null default '{}',
  technologies  text[]      not null default '{}',
  duration      text        not null default '',
  architecture  text        not null default '',
  challenges    text[]      not null default '{}',
  live_url      text,
  github_url    text,
  year          int         not null,
  sort_order    int,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- CATEGORIES
-- ----------------------------------------------------------------
create table if not exists categories (
  id            bigint generated always as identity primary key,
  slug          text    not null unique,
  name          text    not null,
  description   text    not null default '',
  icon          text    not null default 'Code2',
  gradient      text    not null default 'from-violet-500/20 to-blue-500/20',
  project_count int     not null default 0,
  sort_order    int,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- VIDEOS
-- ----------------------------------------------------------------
create table if not exists videos (
  id            bigint generated always as identity primary key,
  title         text    not null,
  description   text    not null default '',
  thumbnail     text    not null default '',
  video_url     text    not null,
  duration      text    not null default '',
  technologies  text[]  not null default '{}',
  project_slug  text,
  sort_order    int,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- CERTIFICATES
-- ----------------------------------------------------------------
create table if not exists certificates (
  id              bigint generated always as identity primary key,
  title           text    not null,
  issuer          text    not null,
  issue_date      date    not null,
  expiry_date     date,
  image_url       text    not null default '',
  verification_url text,
  credential_id   text,
  skills          text[]  not null default '{}',
  sort_order      int,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- SERVICES
-- ----------------------------------------------------------------
create table if not exists services (
  id              text    primary key,   -- e.g. 'web-dev'
  title           text    not null,
  description     text    not null default '',
  icon            text    not null default 'Globe',
  duration        text    not null default '',
  starting_price  numeric not null default 0,
  currency        text    not null default 'USD',
  technologies    text[]  not null default '{}',
  features        text[]  not null default '{}',
  sort_order      int,
  created_at      timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- EXPERIENCE
-- ----------------------------------------------------------------
create table if not exists experiences (
  id               bigint generated always as identity primary key,
  company          text    not null,
  role             text    not null,
  duration         text    not null,
  start_date       date    not null,
  end_date         date,
  description      text    not null default '',
  responsibilities text[]  not null default '{}',
  technologies     text[]  not null default '{}',
  achievements     text[]  not null default '{}',
  sort_order       int,
  created_at       timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- EDUCATION
-- ----------------------------------------------------------------
create table if not exists education (
  id          bigint generated always as identity primary key,
  institution text    not null,
  degree      text    not null,
  field       text    not null,
  duration    text    not null,
  description text    not null default '',
  sort_order  int,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- SKILLS
-- ----------------------------------------------------------------
create table if not exists skills (
  id         bigint generated always as identity primary key,
  name       text    not null,
  level      int     not null check (level between 0 and 100),
  category   text    not null,
  sort_order int,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- STATS
-- ----------------------------------------------------------------
create table if not exists stats (
  id         bigint generated always as identity primary key,
  label      text not null,
  value      text not null,
  sort_order int,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- Row Level Security — public read, no write from the browser
-- ----------------------------------------------------------------
alter table projects      enable row level security;
alter table categories    enable row level security;
alter table videos        enable row level security;
alter table certificates  enable row level security;
alter table services      enable row level security;
alter table experiences   enable row level security;
alter table education     enable row level security;
alter table skills        enable row level security;
alter table stats         enable row level security;

-- Allow anonymous reads (your anon key can SELECT)
create policy "public read projects"      on projects      for select using (true);
create policy "public read categories"    on categories    for select using (true);
create policy "public read videos"        on videos        for select using (true);
create policy "public read certificates"  on certificates  for select using (true);
create policy "public read services"      on services      for select using (true);
create policy "public read experiences"   on experiences   for select using (true);
create policy "public read education"     on education     for select using (true);
create policy "public read skills"        on skills        for select using (true);
create policy "public read stats"         on stats         for select using (true);
