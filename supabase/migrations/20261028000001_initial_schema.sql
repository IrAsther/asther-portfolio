-- =============================================================================
-- Asther Irakaza Portfolio — Supabase Initial Schema Migration
-- Migration: 20261028000001_initial_schema.sql
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- Helper: updated_at trigger function
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- Table: admin_users (Authorized administrators mapping)
-- Authentication is handled by Supabase Auth (auth.users).
-- This table stores authorization roles without passwords.
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'superadmin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- Helper: is_admin() authorization check
-- Never assume any authenticated user is an administrator.
-- Checks both public.admin_users mapping and auth.jwt() app_metadata role.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT TRUE FROM public.admin_users WHERE id = auth.uid()),
    ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'),
    false
  );
$$;

-- -----------------------------------------------------------------------------
-- Table: projects
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  summary TEXT NOT NULL,
  problem TEXT,
  direction TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  status_type TEXT NOT NULL DEFAULT 'planned' CHECK (status_type IN ('showcase', 'active', 'architecture', 'planned')),
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_placeholder BOOLEAN NOT NULL DEFAULT false,
  href TEXT,
  image TEXT,
  secondary_image TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON public.projects(published, featured);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: applications
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  problem TEXT,
  direction TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  status_type TEXT NOT NULL DEFAULT 'concept' CHECK (status_type IN ('showcase', 'in-development', 'prototype', 'architecture', 'concept')),
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  highlights TEXT[] NOT NULL DEFAULT '{}',
  image TEXT,
  secondary_image TEXT,
  demo_url TEXT,
  download_url TEXT,
  github_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_applications_published_featured ON public.applications(published, featured);
CREATE INDEX IF NOT EXISTS idx_applications_slug ON public.applications(slug);
CREATE INDEX IF NOT EXISTS idx_applications_sort_order ON public.applications(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: skill_categories
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skill_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_skill_categories_updated_at
  BEFORE UPDATE ON public.skill_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_skill_categories_sort_order ON public.skill_categories(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: skills
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_skills_category_id ON public.skills(category_id);
CREATE INDEX IF NOT EXISTS idx_skills_sort_order ON public.skills(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: education
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution TEXT NOT NULL,
  field TEXT NOT NULL,
  status TEXT NOT NULL,
  note TEXT,
  current BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_education_updated_at
  BEFORE UPDATE ON public.education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_education_sort_order ON public.education(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: journey_milestones
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.journey_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  institution TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_journey_milestones_updated_at
  BEFORE UPDATE ON public.journey_milestones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_journey_milestones_sort_order ON public.journey_milestones(sort_order ASC);

-- -----------------------------------------------------------------------------
-- Table: page_content
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_page_content_section UNIQUE (page_slug, section_key)
);

CREATE TRIGGER update_page_content_updated_at
  BEFORE UPDATE ON public.page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_page_content_lookup ON public.page_content(page_slug, section_key);

-- -----------------------------------------------------------------------------
-- Table: site_settings
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_site_settings_key ON public.site_settings(key);

-- -----------------------------------------------------------------------------
-- Table: media_assets
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_media_assets_category ON public.media_assets(category);

-- -----------------------------------------------------------------------------
-- Table: audit_logs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- 1. Enable RLS on every table
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Public Read Policies (Anonymous / Public Visitors)
-- Only published records are exposed publicly. Sensitive tables have no public access.
CREATE POLICY "Public visitors can view published projects"
  ON public.projects FOR SELECT
  USING (published = true);

CREATE POLICY "Public visitors can view published applications"
  ON public.applications FOR SELECT
  USING (published = true);

CREATE POLICY "Public visitors can view skill categories"
  ON public.skill_categories FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can view skills"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can view education"
  ON public.education FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can view journey milestones"
  ON public.journey_milestones FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can view published page content"
  ON public.page_content FOR SELECT
  USING (published = true);

CREATE POLICY "Public visitors can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Public visitors can view media assets"
  ON public.media_assets FOR SELECT
  USING (true);

-- Note: public.audit_logs and public.admin_users have NO public SELECT policy.

-- 3. Authenticated Admin Policies (Verified Administrator Authorization)
-- Strictly requires public.is_admin() to be true.
-- Authenticated visitors who are not verified administrators have NO access.

CREATE POLICY "Admins can view admin_users"
  ON public.admin_users FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins have full access to projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to applications"
  ON public.applications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to skill categories"
  ON public.skill_categories FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to education"
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to journey milestones"
  ON public.journey_milestones FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to page content"
  ON public.page_content FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to site settings"
  ON public.site_settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to media assets"
  ON public.media_assets FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins have full access to audit logs"
  ON public.audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
