-- =============================================================================
-- Asther Irakaza Portfolio — Fix Resume Storage Bucket Configuration
-- Migration: 20261111000001_fix_resume_storage_bucket.sql
--
-- Configures the centralized 'portfolio-media' storage bucket to accept
-- PDF resume documents (application/pdf) up to 10 MB (10485760 bytes),
-- while preserving all existing image MIME types and storage objects.
-- =============================================================================

-- 1. Update existing 'portfolio-media' bucket settings
UPDATE storage.buckets
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  file_size_limit = 10485760 -- 10 MB in bytes (10 * 1024 * 1024)
WHERE id = 'portfolio-media';

-- 2. Idempotent insert if the bucket does not exist yet
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio-media',
  'portfolio-media',
  true,
  10485760,
  ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ]
)
ON CONFLICT (id) DO UPDATE
SET 
  allowed_mime_types = ARRAY[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'application/pdf'
  ],
  file_size_limit = 10485760;

