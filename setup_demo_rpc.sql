-- ======================================================================
-- 🛠️ STEP 1: ENABLE THE HTTP EXTENSION (NET)
-- ======================================================================
CREATE EXTENSION IF NOT EXISTS pg_net;

-- ======================================================================
-- 🛠️ STEP 2: CREATE THE RPC FUNCTION (SAME STYLE AS OTP)
-- ======================================================================
-- This function allows the browser to trigger the email without CORS/JWT issues.
-- It bypasses the browser limits by running on the Supabase backend.
-- ======================================================================

CREATE OR REPLACE FUNCTION send_demo_notifications(
  email_to TEXT, 
  user_name TEXT, 
  hotel_name TEXT, 
  booking_time TEXT, 
  type TEXT DEFAULT 'confirmation'
)
RETURNS VOID AS $$
DECLARE
  project_ref TEXT := 'wrtczoijpqkautwmeevb'; -- Your project reference
  service_role_key TEXT := 'REPLACE_WITH_SERVICE_ROLE_KEY'; -- Use dashboard to find this
BEGIN
  PERFORM
    net.http_post(
      url := 'https://' || project_ref || '.supabase.co/functions/v1/demo-notifications',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || service_role_key
      ),
      body := jsonb_build_object(
        'email', email_to,
        'name', user_name,
        'hotelName', hotel_name,
        'time', booking_time,
        'type', type
      )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ======================================================================
-- 🏁 INSTRUCTIONS:
-- 1. Go to Supabase Dashboard > Settings > API
-- 2. Find "service_role" (secret) key.
-- 3. Replace 'REPLACE_WITH_SERVICE_ROLE_KEY' above with that key.
-- 4. Run this script in the SQL Editor.
-- ======================================================================
