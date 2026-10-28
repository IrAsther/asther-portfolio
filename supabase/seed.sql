-- =============================================================================
-- Asther Irakaza Portfolio — Supabase Seed Script
-- File: supabase/seed.sql
--
-- Seeds the database with authentic portfolio data from src/data/*.ts.
-- Non-destructive & fully idempotent:
-- - Uses ON CONFLICT DO NOTHING to preserve any user-edited records.
-- - Uses WHERE NOT EXISTS for relational items without deleting existing data.
-- - Never deletes existing records.
-- - Does not create administrator accounts or bypass RLS.
--
-- Publication Discipline:
-- - Only Dandaza+ is marked published = true (verified showcase).
-- - In-development and placeholder records are seeded as published = false (DRAFT).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Projects
-- -----------------------------------------------------------------------------
INSERT INTO public.projects (
  slug, title, category, summary, problem, direction, technologies,
  status, status_type, published, featured, is_placeholder, href, image, secondary_image, sort_order
)
VALUES
  (
    'dandaza-plus',
    'Dandaza+',
    'Mobile Utility',
    'A mobile utility that helps small merchants and teams record daily sales, expenses, debts, and transactions from one place without paper notebooks.',
    'Daily business records in Burundi often get lost across scattered paper notebooks or slow spreadsheets. Dandaza+ gives shopkeepers a quick mobile interface to capture sales on the spot and generate clean daily summaries.',
    'Built with a lightweight mobile-first interface designed for fast record entry and reliable local storage in low-connectivity settings.',
    ARRAY['Mobile UI', 'Structured Reporting', 'Local Data'],
    'Active build',
    'active',
    true,   -- Published: verified authentic project
    true,   -- Featured on home page
    false,
    '/projects',
    '/projects/dandaza-screen.webp',
    '/projects/dandaza-report.webp',
    1
  ),
  (
    'ai-applied-system',
    'Applied Machine Learning Pipeline',
    'Data & ML',
    'Data preprocessing and model serving experiments built with Python to test inference latency on structured datasets.',
    'Bridging trained models with real applications often fails due to fragile data ingestion. This project focuses on building resilient data transformation pipelines and simple REST endpoints for fast inference.',
    'Using Python with structured validation pipelines and lightweight API endpoints to keep inference response times predictable.',
    ARRAY['Python', 'Data Pipelines', 'Model Serving'],
    'In progress',
    'architecture',
    false,  -- Draft: not yet verified for public showcase
    false,
    true,
    '/projects',
    NULL,
    NULL,
    2
  ),
  (
    'web-platform-core',
    'Component Web Architecture',
    'Frontend Architecture',
    'A fast, accessible web foundation built with Next.js and pure CSS Modules, focusing on typography, layout performance, and zero layout shift.',
    'Modern websites often suffer from unnecessary client bundle overhead and erratic layouts. This project establishes clean CSS token foundations, responsive layouts, and zero-runtime stylesheet efficiency.',
    'Constructed using vanilla CSS custom properties, responsive fluid typography, and semantic HTML5 structural elements.',
    ARRAY['Next.js', 'CSS Modules', 'Design Tokens', 'Accessibility'],
    'Architecture ready',
    'planned',
    false,  -- Draft: architecture exploration
    false,
    true,
    '/projects',
    NULL,
    NULL,
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 2. Applications
-- -----------------------------------------------------------------------------
INSERT INTO public.applications (
  slug, name, category, description, problem, direction, technologies,
  status, status_type, published, featured, highlights, image, secondary_image,
  demo_url, download_url, github_url, sort_order
)
VALUES
  (
    'dandaza-plus',
    'Dandaza+',
    'Mobile & Digital Utility',
    'A focused mobile application engineered for organized daily reporting, structured activity tracking, and accessible operational utility.',
    'Operational tracking and everyday reporting frequently rely on fragmented physical notes or overly complex desktop software, causing friction and delay.',
    'Creating an intuitive mobile-first interface optimized for rapid data capture, structured record summaries, and clear status overviews.',
    ARRAY['Digital Tools', 'Mobile UI', 'Data Management', 'Structured Reporting'],
    'Live / Showcase',
    'showcase',
    true,   -- Published: verified showcase application
    true,   -- Featured
    ARRAY['Streamlined activity record entry', 'Immediate report generation & overview', 'Low-friction mobile navigation'],
    '/projects/dandaza-screen.webp',
    '/projects/dandaza-report.webp',
    NULL,
    NULL,
    NULL,
    1
  ),
  (
    'ese',
    'ESE — Encyclopédie Scolaire Électronique',
    'EdTech Platform',
    'An electronic educational encyclopedia platform designed to organize curriculum materials, structured academic references, and accessible student resources.',
    'Secondary and post-secondary learners often face barriers accessing centralized, curriculum-aligned academic reference materials and verified study documents.',
    'Architecting a performant Vue 3 web platform integrated with Supabase for role-based content access, structured PostgreSQL schema, and secure document storage.',
    ARRAY['Vue 3', 'Supabase', 'PostgreSQL', 'Role-Based Access', 'Storage & RLS'],
    'In Development',
    'in-development',
    false,  -- Draft: in development
    false,
    ARRAY['Curriculum-aligned reference cataloging', 'Row-level security (RLS) and auth', 'Accessible academic resource sharing'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    2
  ),
  (
    'asa',
    'ASA — AI Study Assistant',
    'AI / Education',
    'An intelligent academic study companion exploring conversational revision aids, topic breakdown workflows, and focused learning support.',
    'Students frequently spend disproportionate study time deciphering dense texts without structured diagnostic quizzes or adaptive explanation stepping.',
    'Developing modular prompt pipelines, structured topic breakdown flows, and reactive state management for interactive review sessions.',
    ARRAY['Vue 3', 'Pinia', 'Supabase', 'AI Integration', 'Prompt Pipelines'],
    'In Development',
    'in-development',
    false,  -- Draft: in development
    false,
    ARRAY['Modular prompt pipelines for concept revision', 'Reactive state management for study sessions', 'Student learning context tracking'],
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    3
  ),
  (
    'portfolio-platform',
    'Asther Portfolio & CMS Architecture',
    'Web Architecture & Systems',
    'A high-performance personal web platform featuring custom CSS token architecture, responsive design, and administrative control.',
    'Portfolios frequently lean on bloated third-party template frameworks with excessive dependencies, compromising performance and brand fidelity.',
    'Built from first principles with Next.js App Router, CSS Modules, strict brand token discipline, and Supabase PostgreSQL with RLS.',
    ARRAY['Next.js', 'React', 'TypeScript', 'CSS Modules', 'Supabase', 'PostgreSQL'],
    'Continuous Evolution',
    'concept',
    false,  -- Draft
    false,
    ARRAY['Zero-dependency CSS custom property architecture', 'Authenticated administrative management panel', 'Row-level security enforcement'],
    NULL,
    NULL,
    NULL,
    NULL,
    'https://github.com/IrAsther/asther-portfolio',
    4
  )
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 3. Skill Categories & Skills
-- -----------------------------------------------------------------------------
INSERT INTO public.skill_categories (slug, name, sort_order)
VALUES
  ('prog-languages', 'Programming Languages', 1),
  ('web-frameworks', 'Web Frameworks & Libraries', 2),
  ('backend-databases', 'Backend & Databases', 3),
  ('ai-systems', 'AI & Intelligent Systems', 4),
  ('hardware-prototyping', 'Hardware & Prototyping', 5),
  ('design-tools', 'Design & Creative Tools', 6)
ON CONFLICT (slug) DO NOTHING;

-- Insert skills mapped to category slugs without deleting existing skills
DO $$
DECLARE
  cat_prog UUID;
  cat_web UUID;
  cat_back UUID;
  cat_ai UUID;
  cat_hw UUID;
  cat_des UUID;
BEGIN
  SELECT id INTO cat_prog FROM public.skill_categories WHERE slug = 'prog-languages';
  SELECT id INTO cat_web  FROM public.skill_categories WHERE slug = 'web-frameworks';
  SELECT id INTO cat_back FROM public.skill_categories WHERE slug = 'backend-databases';
  SELECT id INTO cat_ai   FROM public.skill_categories WHERE slug = 'ai-systems';
  SELECT id INTO cat_hw   FROM public.skill_categories WHERE slug = 'hardware-prototyping';
  SELECT id INTO cat_des  FROM public.skill_categories WHERE slug = 'design-tools';

  -- Programming Languages
  IF cat_prog IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_prog, s.name, s.ord FROM (VALUES
      ('Python', 1), ('C', 2), ('JavaScript', 3), ('TypeScript', 4), ('HTML5', 5), ('CSS3', 6)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_prog AND name = s.name
    );
  END IF;

  -- Web Frameworks & Libraries
  IF cat_web IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_web, s.name, s.ord FROM (VALUES
      ('Next.js', 1), ('React', 2), ('Vue 3', 3), ('Django', 4)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_web AND name = s.name
    );
  END IF;

  -- Backend & Databases
  IF cat_back IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_back, s.name, s.ord FROM (VALUES
      ('Supabase', 1), ('PostgreSQL', 2), ('Row-Level Security (RLS)', 3)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_back AND name = s.name
    );
  END IF;

  -- AI & Intelligent Systems
  IF cat_ai IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_ai, s.name, s.ord FROM (VALUES
      ('Python', 1), ('AI / ML Pipelines', 2), ('AI Model Integration', 3)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_ai AND name = s.name
    );
  END IF;

  -- Hardware & Prototyping
  IF cat_hw IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_hw, s.name, s.ord FROM (VALUES
      ('Arduino', 1)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_hw AND name = s.name
    );
  END IF;

  -- Design & Creative Tools
  IF cat_des IS NOT NULL THEN
    INSERT INTO public.skills (category_id, name, sort_order)
    SELECT cat_des, s.name, s.ord FROM (VALUES
      ('Photoshop', 1), ('Canva', 2)
    ) AS s(name, ord)
    WHERE NOT EXISTS (
      SELECT 1 FROM public.skills WHERE category_id = cat_des AND name = s.name
    );
  END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 4. Education
-- -----------------------------------------------------------------------------
INSERT INTO public.education (institution, field, status, note, current, sort_order)
SELECT
  'University of the People',
  'Computer Science',
  'Current studies',
  'Online Bachelor of Science degree program focusing on software engineering, data structures, algorithms, and computational principles.',
  true,
  1
WHERE NOT EXISTS (
  SELECT 1 FROM public.education
  WHERE institution = 'University of the People' AND field = 'Computer Science'
);

INSERT INTO public.education (institution, field, status, note, current, sort_order)
SELECT
  'Institut des Technologies Numériques (ITN)',
  'Technology & Computer Science Studies',
  'Completed foundational studies',
  'University of Burundi. Immersive academic coursework in computer science foundations, information technology, and programming principles.',
  false,
  2
WHERE NOT EXISTS (
  SELECT 1 FROM public.education
  WHERE institution = 'Institut des Technologies Numériques (ITN)'
);

-- -----------------------------------------------------------------------------
-- 5. Journey Milestones
-- -----------------------------------------------------------------------------
INSERT INTO public.journey_milestones (slug, label, institution, description, sort_order)
VALUES
  (
    'gisenyi',
    'Secondary School',
    'GISENYI School',
    'Foundational education and early formation of analytical thinking.',
    1
  ),
  (
    'butara',
    'Secondary School',
    'BUTARA School',
    'Continued academic development and growing interest in technology.',
    2
  ),
  (
    'itn',
    'Technology Studies',
    'Institut des Technologies Numériques',
    'Formal immersion in computer science and digital technologies at the University of Burundi.',
    3
  )
ON CONFLICT (slug) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 6. Site Settings
-- -----------------------------------------------------------------------------
INSERT INTO public.site_settings (key, value)
VALUES
  (
    'site_config',
    '{
      "siteName": "Asther Irakaza",
      "shortBrand": "Asther",
      "title": "Software Developer & Computer Science Student",
      "description": "Portfolio of Asther Irakaza — software developer, computer science student, and designer building thoughtful digital systems and utilities.",
      "contactEmail": "asther.irakaza@example.com",
      "affiliation": "University of the People",
      "appearance": {
        "primaryBrand": "#01605A",
        "accentColor": "#FF862D",
        "supportingColor": "#FFD0A8",
        "themeDefault": "dark"
      }
    }'::jsonb
  )
ON CONFLICT (key) DO NOTHING;

-- -----------------------------------------------------------------------------
-- 7. Page Content (About & Resume positioning)
-- -----------------------------------------------------------------------------
INSERT INTO public.page_content (page_slug, section_key, content, published)
VALUES
  (
    'about',
    'profile',
    '{
      "name": "Asther Irakaza",
      "role": "Software Developer",
      "subtitles": ["Computer Science Student", "AI/ML Enthusiast", "Graphic Designer"],
      "positioning": "Computer Science Student @ University of the People | Aspiring Software Developer | AI & Machine Learning Enthusiast | Graphic Designer | Building Technology for Real-World Impact",
      "summary": "Software developer and computer science student with a focused commitment to building functional web applications, intelligent systems, and accessible digital utilities."
    }'::jsonb,
    true
  )
ON CONFLICT (page_slug, section_key) DO NOTHING;
