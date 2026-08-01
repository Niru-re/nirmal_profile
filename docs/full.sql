-- ============================================================
--  NIRMAAN PORTFOLIO — Full SQL (Schema + Seed)
--  Run this once in Supabase SQL Editor.
--  Safe to re-run: uses ON CONFLICT DO UPDATE / DO NOTHING.
-- ============================================================


-- ----------------------------------------------------------------
-- STEP 1 — CREATE TABLES
-- ----------------------------------------------------------------

create table if not exists projects (
  id               bigint generated always as identity primary key,
  slug             text        not null unique,
  title            text        not null,
  description      text        not null default '',
  long_description text        not null default '',
  category         text        not null,
  featured         boolean     not null default false,
  cover_image      text        not null default '',
  demo_video       text,
  screenshots      text[]      not null default '{}',
  features         text[]      not null default '{}',
  technologies     text[]      not null default '{}',
  duration         text        not null default '',
  architecture     text        not null default '',
  challenges       text[]      not null default '{}',
  live_url         text,
  github_url       text,
  year             int         not null,
  sort_order       int,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

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

create table if not exists videos (
  id           bigint generated always as identity primary key,
  title        text    not null,
  description  text    not null default '',
  thumbnail    text    not null default '',
  video_url    text    not null,
  duration     text    not null default '',
  technologies text[]  not null default '{}',
  project_slug text,
  sort_order   int,
  created_at   timestamptz not null default now()
);

create table if not exists certificates (
  id               bigint generated always as identity primary key,
  title            text    not null,
  issuer           text    not null,
  issue_date       date    not null,
  expiry_date      date,
  image_url        text    not null default '',
  verification_url text,
  credential_id    text,
  skills           text[]  not null default '{}',
  sort_order       int,
  created_at       timestamptz not null default now()
);

create table if not exists services (
  id             text    primary key,
  title          text    not null,
  description    text    not null default '',
  icon           text    not null default 'Globe',
  duration       text    not null default '',
  starting_price numeric not null default 0,
  currency       text    not null default 'USD',
  technologies   text[]  not null default '{}',
  features       text[]  not null default '{}',
  sort_order     int,
  created_at     timestamptz not null default now()
);

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

create table if not exists skills (
  id         bigint generated always as identity primary key,
  name       text    not null,
  level      int     not null check (level between 0 and 100),
  category   text    not null,
  sort_order int,
  created_at timestamptz not null default now()
);

create table if not exists stats (
  id         bigint generated always as identity primary key,
  label      text not null,
  value      text not null,
  sort_order int,
  created_at timestamptz not null default now()
);


-- ----------------------------------------------------------------
-- STEP 2 — ROW LEVEL SECURITY (public read, no browser writes)
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

do $$ begin
  if not exists (select 1 from pg_policies where tablename='projects'     and policyname='public read projects')     then create policy "public read projects"     on projects     for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='categories'   and policyname='public read categories')   then create policy "public read categories"   on categories   for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='videos'       and policyname='public read videos')       then create policy "public read videos"       on videos       for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='certificates' and policyname='public read certificates') then create policy "public read certificates" on certificates for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='services'     and policyname='public read services')     then create policy "public read services"     on services     for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='experiences'  and policyname='public read experiences')  then create policy "public read experiences"  on experiences  for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='education'    and policyname='public read education')    then create policy "public read education"    on education    for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='skills'       and policyname='public read skills')       then create policy "public read skills"       on skills       for select using (true); end if;
  if not exists (select 1 from pg_policies where tablename='stats'        and policyname='public read stats')        then create policy "public read stats"        on stats        for select using (true); end if;
end $$;


-- ----------------------------------------------------------------
-- STEP 3 — SEED DATA
-- ----------------------------------------------------------------

-- STATS
insert into stats (label, value, sort_order) values
  ('Projects Completed', '40+', 1),
  ('Years Experience',   '4+',  2),
  ('Technologies',       '25+', 3),
  ('Happy Clients',      '30+', 4)
on conflict do nothing;


-- CATEGORIES
insert into categories (slug, name, description, icon, gradient, project_count, sort_order) values
  ('web-development',  'Web Development',  'Full-stack applications with modern frameworks and scalable architecture.',   'Code2',    'from-violet-500/20 to-blue-500/20',   8,  1),
  ('web-design',       'Web Design',       'Pixel-perfect interfaces with premium aesthetics and intuitive UX.',          'Palette',  'from-blue-500/20 to-cyan-500/20',     5,  2),
  ('data-science',     'Data Science',     'Insights-driven analytics, visualization, and statistical modeling.',         'BarChart3','from-cyan-500/20 to-emerald-500/20',  4,  3),
  ('machine-learning', 'Machine Learning', 'Predictive models, NLP pipelines, and intelligent automation.',               'Brain',    'from-purple-500/20 to-violet-500/20', 3,  4),
  ('python',           'Python',           'Backend services, automation scripts, and data processing pipelines.',        'Terminal', 'from-yellow-500/20 to-orange-500/20', 6,  5),
  ('power-bi',         'Power BI',         'Interactive dashboards and executive reporting solutions.',                    'PieChart', 'from-amber-500/20 to-yellow-500/20',  3,  6),
  ('sql',              'SQL',              'Database design, query optimization, and data warehousing.',                  'Database', 'from-sky-500/20 to-indigo-500/20',    4,  7),
  ('video-editing',    'Video Editing',    'Product demos, motion graphics, and cinematic presentations.',                'Film',     'from-rose-500/20 to-pink-500/20',     2,  8),
  ('ui-ux-design',     'UI/UX Design',     'User research, wireframes, prototypes, and design systems.',                  'PenTool',  'from-indigo-500/20 to-purple-500/20', 5,  9),
  ('automation',       'Automation',       'Workflow automation, CI/CD pipelines, and intelligent bots.',                 'Zap',      'from-teal-500/20 to-cyan-500/20',     3, 10)
on conflict (slug) do update set
  name          = excluded.name,
  description   = excluded.description,
  icon          = excluded.icon,
  gradient      = excluded.gradient,
  project_count = excluded.project_count,
  sort_order    = excluded.sort_order;


-- PROJECTS
insert into projects (
  slug, title, description, long_description,
  category, featured,
  cover_image, demo_video,
  screenshots, features, technologies,
  duration, architecture, challenges,
  live_url, github_url, year, sort_order
) values
(
  'enterprise-analytics-platform',
  'Enterprise Analytics Platform',
  'Real-time business intelligence dashboard with predictive analytics and custom reporting.',
  'A comprehensive analytics platform designed for enterprise teams to visualize KPIs, track performance metrics, and generate AI-powered insights. Built with a focus on scalability, real-time data processing, and an intuitive user experience.',
  'web-development', true,
  'analytics-cover.jpg',        -- upload to "projects" bucket
  'analytics-demo.mp4',         -- upload to "videos" bucket
  array['analytics-1.jpg','analytics-2.jpg','analytics-3.jpg'],
  array[
    'Real-time data streaming with WebSocket integration',
    'Custom dashboard builder with drag-and-drop widgets',
    'AI-powered anomaly detection and forecasting',
    'Role-based access control and team collaboration',
    'Export to PDF, Excel, and scheduled email reports'
  ],
  array['Next.js','TypeScript','PostgreSQL','Redis','Python','Power BI'],
  '4 months',
  'Microservices architecture with Next.js frontend, FastAPI backend, PostgreSQL for persistence, Redis for caching, and Apache Kafka for event streaming.',
  array[
    'Optimized query performance for datasets exceeding 10M rows',
    'Implemented real-time sync across 50+ concurrent dashboard users',
    'Designed a flexible widget system supporting 20+ chart types'
  ],
  'https://demo.example.com', 'https://github.com/nirmaan/analytics-platform',
  2025, 1
),
(
  'ai-content-studio',
  'AI Content Studio',
  'Generative AI platform for creating, editing, and publishing multimedia content at scale.',
  'An end-to-end content creation platform leveraging large language models and diffusion models to help teams produce high-quality written and visual content. Features collaborative editing, brand voice customization, and multi-format export.',
  'machine-learning', true,
  'ai-studio-cover.jpg',
  'ai-studio-demo.mp4',
  array['ai-studio-1.jpg','ai-studio-2.jpg'],
  array[
    'Multi-model AI generation (text, image, video)',
    'Brand voice training and consistency checks',
    'Collaborative real-time editing',
    'Content calendar and scheduling',
    'SEO optimization suggestions'
  ],
  array['React','Python','FastAPI','OpenAI API','Supabase','Tailwind CSS'],
  '3 months',
  'React SPA with FastAPI middleware orchestrating multiple AI providers. Supabase for auth and storage. Queue-based job processing with Celery.',
  array[
    'Reduced AI generation latency by 60% through intelligent caching',
    'Built a prompt engineering pipeline for consistent brand output',
    'Handled rate limiting across multiple AI provider APIs'
  ],
  'https://demo.example.com', 'https://github.com/nirmaan/ai-content-studio',
  2025, 2
),
(
  'design-system-hub',
  'Design System Hub',
  'Comprehensive design system with component library, documentation, and Figma integration.',
  'A living design system that serves as the single source of truth for product teams. Includes a fully documented component library, design tokens, accessibility guidelines, and seamless Figma-to-code workflow.',
  'ui-ux-design', true,
  'design-system-cover.jpg',
  null,
  array['design-system-1.jpg','design-system-2.jpg'],
  array[
    '50+ accessible React components',
    'Design token management with theming',
    'Interactive documentation with Storybook',
    'Figma plugin for design-code sync',
    'Automated visual regression testing'
  ],
  array['React','TypeScript','Storybook','Tailwind CSS','Figma API'],
  '2 months',
  'Monorepo with packages for tokens, components, and documentation. CI/CD pipeline for automated publishing and visual testing.',
  array[
    'Achieved WCAG 2.1 AA compliance across all components',
    'Reduced design-to-development handoff time by 70%',
    'Built a token pipeline syncing Figma variables to CSS custom properties'
  ],
  null, 'https://github.com/nirmaan/design-system-hub',
  2024, 3
),
(
  'ecommerce-dashboard',
  'E-Commerce Command Center',
  'Unified dashboard for managing inventory, orders, customers, and revenue analytics.',
  'A powerful e-commerce management platform providing merchants with real-time visibility into their business operations. Features inventory tracking, order fulfillment workflows, customer segmentation, and revenue forecasting.',
  'web-development', false,
  'ecommerce-cover.jpg',
  null,
  array['ecommerce-1.jpg'],
  array[
    'Real-time inventory management',
    'Order processing automation',
    'Customer segmentation and CRM',
    'Revenue forecasting with ML models',
    'Multi-channel sales integration'
  ],
  array['Next.js','Node.js','PostgreSQL','Stripe','Chart.js'],
  '3 months',
  'Next.js full-stack application with tRPC for type-safe APIs, PostgreSQL with Prisma ORM, and Stripe for payment processing.',
  array[
    'Integrated 5 third-party sales channels into a unified view',
    'Built inventory sync handling 100K+ SKUs'
  ],
  'https://demo.example.com', null,
  2024, 4
),
(
  'data-pipeline-automation',
  'Data Pipeline Automation',
  'Automated ETL pipelines for ingesting, transforming, and loading data from multiple sources.',
  'An enterprise-grade data pipeline system that automates the extraction, transformation, and loading of data from diverse sources into a centralized data warehouse with monitoring and alerting.',
  'automation', false,
  'pipeline-cover.jpg',
  null,
  array['pipeline-1.jpg'],
  array[
    'Visual pipeline builder',
    'Scheduled and event-triggered runs',
    'Data quality validation rules',
    'Error handling with automatic retries',
    'Pipeline monitoring dashboard'
  ],
  array['Python','Apache Airflow','SQL','Docker','AWS S3'],
  '2 months',
  'Apache Airflow orchestrating Python ETL scripts, with data stored in AWS S3 and loaded into PostgreSQL data warehouse.',
  array[
    'Processed 500GB+ daily data volume reliably',
    'Reduced pipeline failure rate to under 0.1%'
  ],
  null, 'https://github.com/nirmaan/data-pipeline',
  2024, 5
),
(
  'power-bi-sales-dashboard',
  'Sales Performance Dashboard',
  'Executive Power BI dashboard with drill-down analytics and automated refresh.',
  'A comprehensive sales analytics dashboard built in Power BI, providing executives with real-time visibility into sales performance, regional breakdowns, and product category trends.',
  'power-bi', false,
  'powerbi-cover.jpg',
  null,
  array['powerbi-1.jpg'],
  array[
    'Interactive drill-down by region and product',
    'Automated daily data refresh',
    'Mobile-optimized report views',
    'Custom DAX measures for KPIs',
    'Embedded sharing with row-level security'
  ],
  array['Power BI','DAX','SQL Server','Azure Data Factory'],
  '1 month',
  'Azure Data Factory for ETL, SQL Server as data source, Power BI Service for publishing and sharing.',
  array[
    'Optimized DAX queries reducing report load time by 80%',
    'Implemented row-level security for 200+ users'
  ],
  null, null,
  2024, 6
)
on conflict (slug) do update set
  title            = excluded.title,
  description      = excluded.description,
  long_description = excluded.long_description,
  category         = excluded.category,
  featured         = excluded.featured,
  cover_image      = excluded.cover_image,
  demo_video       = excluded.demo_video,
  screenshots      = excluded.screenshots,
  features         = excluded.features,
  technologies     = excluded.technologies,
  duration         = excluded.duration,
  architecture     = excluded.architecture,
  challenges       = excluded.challenges,
  live_url         = excluded.live_url,
  github_url       = excluded.github_url,
  year             = excluded.year,
  sort_order       = excluded.sort_order;


-- VIDEOS
-- video_url  → filename you uploaded to the "videos"     Storage bucket
-- thumbnail  → filename you uploaded to the "thumbnails" Storage bucket
-- Replace the filenames below with your actual uploaded file names.
insert into videos (title, description, thumbnail, video_url, duration, technologies, project_slug, sort_order) values
  (
    'Enterprise Analytics Platform — Full Demo',
    'Complete walkthrough of the analytics platform showcasing real-time dashboards, custom widgets, and AI-powered insights.',
    'analytics-thumb.jpg',   -- your thumbnail filename in "thumbnails" bucket
    'analytics-demo.mp4',    -- your video filename in "videos" bucket
    '4:32',
    array['Next.js','PostgreSQL','Python'],
    'enterprise-analytics-platform', 1
  ),
  (
    'AI Content Studio — Product Overview',
    'Demonstration of the AI content generation platform with multi-model support and collaborative editing.',
    'ai-studio-thumb.jpg',
    'ai-studio-demo.mp4',
    '3:15',
    array['React','Python','OpenAI'],
    'ai-content-studio', 2
  ),
  (
    'Design System Hub — Component Library Tour',
    'Tour of the design system including component documentation, theming, and Figma integration.',
    'design-system-thumb.jpg',
    'design-system-demo.mp4',
    '5:48',
    array['React','Storybook','Figma'],
    'design-system-hub', 3
  ),
  (
    'E-Commerce Dashboard — Feature Showcase',
    'Overview of inventory management, order processing, and revenue analytics features.',
    'ecommerce-thumb.jpg',
    'ecommerce-demo.mp4',
    '2:56',
    array['Next.js','Stripe','Chart.js'],
    'ecommerce-dashboard', 4
  )
on conflict do nothing;


-- CERTIFICATES
insert into certificates (title, issuer, issue_date, expiry_date, image_url, verification_url, credential_id, skills, sort_order) values
  (
    'AWS Certified Solutions Architect', 'Amazon Web Services',
    '2024-06-01', '2027-06-01',
    'aws-saa.jpg',                             -- upload to "certificates" bucket
    'https://aws.amazon.com/verification',
    'AWS-SAA-2024-XXXX',
    array['AWS','Cloud Architecture','DevOps'], 1
  ),
  (
    'Google Professional Data Engineer', 'Google Cloud',
    '2024-03-01', null,
    'gcp-de.jpg',
    'https://cloud.google.com/certification',
    'GCP-DE-2024-XXXX',
    array['GCP','Data Engineering','BigQuery'], 2
  ),
  (
    'Meta Front-End Developer', 'Meta',
    '2023-11-01', null,
    'meta-fe.jpg',
    'https://coursera.org/verify',
    'META-FE-2023-XXXX',
    array['React','JavaScript','CSS','Testing'], 3
  ),
  (
    'Microsoft Power BI Data Analyst', 'Microsoft',
    '2023-08-01', null,
    'powerbi.jpg',
    'https://learn.microsoft.com/credentials',
    'PL-300-2023-XXXX',
    array['Power BI','DAX','Data Modeling'], 4
  ),
  (
    'TensorFlow Developer Certificate', 'Google / TensorFlow',
    '2023-05-01', null,
    'tensorflow.jpg',
    'https://tensorflow.org/certificate',
    'TF-DEV-2023-XXXX',
    array['TensorFlow','Deep Learning','Python'], 5
  ),
  (
    'UI/UX Design Specialization', 'California Institute of the Arts',
    '2022-12-01', null,
    'uiux.jpg',
    'https://coursera.org/verify',
    'CALARTS-UX-2022-XXXX',
    array['UI Design','UX Research','Prototyping'], 6
  )
on conflict do nothing;


-- SERVICES
insert into services (id, title, description, icon, duration, starting_price, currency, technologies, features, sort_order) values
  (
    'web-dev', 'Website Development',
    'Premium, performant websites and web applications built with modern frameworks and best practices.',
    'Globe', '2–8 weeks', 1500, 'USD',
    array['Next.js','React','TypeScript','Tailwind CSS'],
    array['Responsive design','SEO optimization','Performance tuning','CMS integration','Analytics setup'],
    1
  ),
  (
    'dashboard', 'Dashboard Development',
    'Interactive dashboards and admin panels with real-time data visualization and analytics.',
    'LayoutDashboard', '3–10 weeks', 2500, 'USD',
    array['React','D3.js','PostgreSQL','Power BI'],
    array['Custom charts & widgets','Real-time data sync','Role-based access','Export & reporting','Mobile responsive'],
    2
  ),
  (
    'analytics', 'Data Analytics',
    'Transform raw data into actionable insights with advanced analytics and visualization.',
    'BarChart3', '2–6 weeks', 1200, 'USD',
    array['Python','SQL','Power BI','Pandas'],
    array['Data cleaning & ETL','Statistical analysis','Interactive reports','Automated pipelines','KPI dashboards'],
    3
  ),
  (
    'ml', 'Machine Learning',
    'Custom ML models for prediction, classification, NLP, and intelligent automation.',
    'Brain', '4–12 weeks', 3000, 'USD',
    array['Python','TensorFlow','scikit-learn','FastAPI'],
    array['Model development','Data preprocessing','API deployment','Performance monitoring','Documentation'],
    4
  ),
  (
    'ui-design', 'UI Design',
    'Beautiful, user-centered interface designs with comprehensive design systems.',
    'Palette', '1–4 weeks', 800, 'USD',
    array['Figma','Adobe XD','Prototyping'],
    array['Wireframes & mockups','Design system','Interactive prototypes','Accessibility audit','Developer handoff'],
    5
  ),
  (
    'video', 'Video Editing',
    'Professional product demos, promotional videos, and motion graphics.',
    'Film', '1–3 weeks', 500, 'USD',
    array['Premiere Pro','After Effects','DaVinci Resolve'],
    array['Product demos','Motion graphics','Color grading','Sound design','Multi-format export'],
    6
  )
on conflict (id) do update set
  title          = excluded.title,
  description    = excluded.description,
  icon           = excluded.icon,
  duration       = excluded.duration,
  starting_price = excluded.starting_price,
  currency       = excluded.currency,
  technologies   = excluded.technologies,
  features       = excluded.features,
  sort_order     = excluded.sort_order;


-- EXPERIENCES
insert into experiences (company, role, duration, start_date, end_date, description, responsibilities, technologies, achievements, sort_order) values
  (
    'TechVentures Inc.', 'Senior Full-Stack Developer',
    'Jan 2024 — Present', '2024-01-01', null,
    'Leading development of enterprise SaaS products with a focus on performance, scalability, and premium user experience.',
    array[
      'Architect and build full-stack features for a B2B analytics platform serving 10K+ users',
      'Lead code reviews and establish engineering best practices across the team',
      'Collaborate with design team to implement pixel-perfect, accessible interfaces',
      'Optimize application performance achieving 95+ Lighthouse scores'
    ],
    array['Next.js','TypeScript','PostgreSQL','Redis','AWS','Docker'],
    array[
      'Reduced page load time by 45% through code splitting and caching strategies',
      'Shipped 3 major product features ahead of schedule',
      'Mentored 2 junior developers to mid-level proficiency'
    ],
    1
  ),
  (
    'DataFlow Solutions', 'Full-Stack Developer',
    'Jun 2022 — Dec 2023', '2022-06-01', '2023-12-31',
    'Built data visualization tools and analytics dashboards for enterprise clients in finance and healthcare.',
    array[
      'Developed interactive dashboards using React and D3.js',
      'Built RESTful APIs and GraphQL endpoints for data services',
      'Implemented ETL pipelines for real-time data processing',
      'Created automated testing suites with 90%+ coverage'
    ],
    array['React','Node.js','Python','PostgreSQL','Power BI','GraphQL'],
    array[
      'Delivered 8 client projects on time with 100% satisfaction rate',
      'Built reusable component library adopted by entire engineering team',
      'Automated reporting saving 20+ hours per week for analytics team'
    ],
    2
  ),
  (
    'Creative Digital Agency', 'Frontend Developer & Designer',
    'Mar 2021 — May 2022', '2021-03-01', '2022-05-31',
    'Designed and developed premium websites and web applications for diverse clients across industries.',
    array[
      'Designed and implemented responsive websites for 15+ clients',
      'Created UI/UX prototypes and design systems in Figma',
      'Developed custom WordPress themes and React applications',
      'Managed client relationships and project timelines'
    ],
    array['React','Next.js','Figma','WordPress','Tailwind CSS','GSAP'],
    array[
      'Won agency''s ''Best Design'' award for e-commerce redesign project',
      'Increased client conversion rates by average of 35%',
      'Built agency''s first component library reducing dev time by 40%'
    ],
    3
  )
on conflict do nothing;


-- EDUCATION
insert into education (institution, degree, field, duration, description, sort_order) values
  (
    'University of Technology',
    'Bachelor of Technology',
    'Computer Science & Engineering',
    '2017 — 2021',
    'Focused on software engineering, data structures, machine learning, and web technologies.',
    1
  )
on conflict do nothing;


-- SKILLS
insert into skills (name, level, category, sort_order) values
  ('TypeScript',       95, 'Frontend',  1),
  ('React / Next.js',  95, 'Frontend',  2),
  ('Tailwind CSS',     90, 'Frontend',  3),
  ('Node.js',          85, 'Backend',   4),
  ('Python',           90, 'Backend',   5),
  ('PostgreSQL',       85, 'Database',  6),
  ('Supabase',         80, 'Backend',   7),
  ('Power BI',         85, 'Analytics', 8),
  ('Machine Learning', 75, 'AI/ML',     9),
  ('Figma',            85, 'Design',   10),
  ('Docker',           75, 'DevOps',   11),
  ('AWS',              70, 'DevOps',   12)
on conflict do nothing;


-- ================================================================
--  STORAGE BUCKETS — create these manually in Supabase Dashboard
--  Storage → New bucket for each one below:
--
--  Bucket name    Public   Used for
--  ------------   ------   ----------------------------------------
--  videos         YES      .mp4 / .webm video files
--  thumbnails     YES      video thumbnail images (.jpg/.webp)
--  projects       YES      project cover images & screenshots
--  certificates   YES      certificate images
--
--  After creating buckets, upload your files and the app will
--  automatically build the full public URL from the filename alone.
-- ================================================================
