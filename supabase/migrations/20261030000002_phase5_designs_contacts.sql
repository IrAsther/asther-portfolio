-- =============================================================================
-- Phase 5 Migration — Designs + Contact Messages + Storage (Idempotent)
-- Migration: 20261030000002_phase5_designs_contacts.sql
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Table: designs
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'UI/UX Design',
  description TEXT,
  tools TEXT[] NOT NULL DEFAULT '{}',
  cover_image TEXT,
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  external_url TEXT,
  project_date DATE,
  published BOOLEAN NOT NULL DEFAULT false,
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

DROP TRIGGER IF EXISTS update_designs_updated_at ON public.designs;
CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_designs_published_featured ON public.designs(published, featured);
CREATE INDEX IF NOT EXISTS idx_designs_slug ON public.designs(slug);
CREATE INDEX IF NOT EXISTS idx_designs_sort_order ON public.designs(sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_designs_category ON public.designs(category);

-- -----------------------------------------------------------------------------
-- 2. Table: contact_messages
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  replied_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  website TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_is_read ON public.contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- -----------------------------------------------------------------------------
-- 3. RLS Activation
-- -----------------------------------------------------------------------------
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- 4. RLS Policies: designs
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public visitors can view published designs" ON public.designs;
CREATE POLICY "Public visitors can view published designs"
  ON public.designs FOR SELECT
  USING (published = true);

DROP POLICY IF EXISTS "Admins have full access to designs" ON public.designs;
CREATE POLICY "Admins have full access to designs"
  ON public.designs FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- 5. RLS Policies: contact_messages
-- -----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Public visitors can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public visitors can submit contact messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (
    status = 'new'
    AND is_read = false
    AND replied_at IS NULL
    AND archived_at IS NULL
  );

DROP POLICY IF EXISTS "Admins can view all contact messages" ON public.contact_messages;
CREATE POLICY "Admins can view all contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Admins can update contact messages" ON public.contact_messages;
CREATE POLICY "Admins can update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admins can delete contact messages" ON public.contact_messages;
CREATE POLICY "Admins can delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Storage Bucket & Policies
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Admins can upload media" ON storage.objects;
CREATE POLICY "Admins can upload media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'portfolio-media'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can update media" ON storage.objects;
CREATE POLICY "Admins can update media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can delete media" ON storage.objects;
CREATE POLICY "Admins can delete media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'portfolio-media'
    AND public.is_admin()
  );

DROP POLICY IF EXISTS "Public read access to portfolio media" ON storage.objects;
CREATE POLICY "Public read access to portfolio media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-media');
