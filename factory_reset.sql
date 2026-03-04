-- COPY AND PASTE THIS ENTIRE SNIPPET INTO YOUR SUPABASE SQL EDITOR
-- 1. Go to https://supabase.com/dashboard/project/_/sql/new
-- 2. Paste this code and click RUN
-- DANGER: This will permanently delete ALL users, stores, products, stories, and orders.

TRUNCATE auth.users CASCADE;
