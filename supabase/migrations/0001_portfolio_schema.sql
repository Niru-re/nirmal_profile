create extension if not exists "uuid-ossp";

create or replace function moddatetime() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.categories (
  slug          text primary key,
  name          text not null,
  description   text not null default '',
  icon          text not null default 'Folder',
  gradient      text not null default 'from-violet-500/20 to-blue-500/20',
  project_count integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger handle_updated_at before update on public.categories
  for each row execute function moddatetime();

create table if not exists public.projects (
  slug             text primary key,
  title            text not null,
  description      text not null,
  long_description text not null default '',
  category         text not null references public.categories(slug) on delete cascade on update cascade,
  featured         boolean not null default false,
  cover_image      text not null,
  demo_video       text,
  screenshots      text[] not null default '{}',
  features         text[] not null default '{}',
  technologies     text[] not null default '{}',
  duration         text,
  architecture     text,
  challenges       text[] not null default '{}',
  live_url         text,
  github_url       text,
  year             integer not null default extract(year from now()),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index projects_year_idx     on public.projects (year desc);
create index projects_category_idx on public.projects (category);
create trigger handle_updated_at before update on public.projects
  for each row execute function moddatetime();

create table if not exists public.experiences (
  id               uuid primary key default uuid_generate_v4(),
  company          text not null,
  role             text not null,
  duration         text not null,
  start_date       date not null,
  end_date         date,
  description      text,
  responsibilities text[] not null default '{}',
  technologies     text[] not null default '{}',
  achievements     text[] not null default '{}',
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger handle_updated_at before update on public.experiences
  for each row execute function moddatetime();

create table if not exists public.education (
  id           uuid primary key default uuid_generate_v4(),
  institution  text not null,
  degree       text not null,
  field        text not null,
  duration     text not null,
  description  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger handle_updated_at before update on public.education
  for each row execute function moddatetime();

create table if not exists public.skills (
  name       text primary key,
  level      smallint not null check (level between 0 and 100),
  category   text not null check (category in ('Frontend','Backend','Database','Analytics','AI/ML','Design','DevOps')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger handle_updated_at before update on public.skills
  for each row execute function moddatetime();

create table if not exists public.certificates (
  id               uuid primary key default uuid_generate_v4(),
  title            text not null,
  issuer           text not null,
  issue_date       date not null,
  expiry_date      date,
  image_url        text,
  verification_url text,
  credential_id    text,
  skills           text[] not null default '{}',
  sort_order       integer not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create trigger handle_updated_at before update on public.certificates
  for each row execute function moddatetime();

create table if not exists public.services (
  id             text primary key,
  title          text not null,
  description    text not null,
  icon           text not null default 'Star',
  duration       text,
  starting_price numeric(12,2) not null default 0,
  currency       text not null default 'USD' check (currency in ('USD','EUR','GBP','INR')),
  technologies   text[] not null default '{}',
  features       text[] not null default '{}',
  sort_order     integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create trigger handle_updated_at before update on public.services
  for each row execute function moddatetime();

create table if not exists public.contact_submissions (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  read_at    timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.videos (
  id            text primary key,
  title         text not null,
  description   text not null default '',
  thumbnail     text not null,
  video_url     text not null,
  duration      text,
  technologies  text[] not null default '{}',
  project_slug  text references public.projects(slug) on delete set null on update cascade,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger handle_updated_at before update on public.videos
  for each row execute function moddatetime();

create table if not exists public.stats (
  label      text primary key,
  value      text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger handle_updated_at before update on public.stats
  for each row execute function moddatetime();

alter table public.categories          enable row level security;
alter table public.projects            enable row level security;
alter table public.experiences         enable row level security;
alter table public.education           enable row level security;
alter table public.skills              enable row level security;
alter table public.certificates        enable row level security;
alter table public.services            enable row level security;
alter table public.videos              enable row level security;
alter table public.stats               enable row level security;
alter table public.contact_submissions enable row level security;

create policy "Public read" on public.categories          for select using (true);
create policy "Public read" on public.projects            for select using (true);
create policy "Public read" on public.experiences         for select using (true);
create policy "Public read" on public.education           for select using (true);
create policy "Public read" on public.skills              for select using (true);
create policy "Public read" on public.certificates        for select using (true);
create policy "Public read" on public.services            for select using (true);
create policy "Public read" on public.videos              for select using (true);
create policy "Public read" on public.stats               for select using (true);
create policy "Anyone can submit contact form" on public.contact_submissions
  for insert with check (true);
