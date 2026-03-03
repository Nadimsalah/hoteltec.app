-- 1. Ensure the bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('store-assets', 'store-assets', true) 
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view assets" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own assets" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own assets" ON storage.objects;

-- 3. Create fresh, robust policies
-- Policy: SELECT (Public Read)
CREATE POLICY "Anyone can view assets" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'store-assets');

-- Policy: INSERT (Authenticated Upload)
CREATE POLICY "Authenticated users can upload assets" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'store-assets' AND auth.role() = 'authenticated');

-- Policy: UPDATE (Authenticated Manage)
CREATE POLICY "Users can update their own assets" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'store-assets' AND auth.role() = 'authenticated');

-- Policy: DELETE (Authenticated Manage)
CREATE POLICY "Users can delete their own assets" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'store-assets' AND auth.role() = 'authenticated');
