-- COPY AND PASTE THIS ENTIRE SNIPPET INTO YOUR SUPABASE SQL EDITOR
-- 1. Go to https://supabase.com/dashboard/project/_/sql/new
-- 2. Paste this code and click RUN
-- This will add the missing 'slug' column to your stores table to enable custom domains.

ALTER TABLE stores ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
