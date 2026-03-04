-- ======================================================================
-- SETUP DEMO BOOKINGS & AUTOMATED REMINDER SYSTEM
-- ======================================================================
-- This script creates the core table for managing demo requests
-- and the logic for the 1-hour email reminder system.
-- ======================================================================

-- 1. Table Creation
CREATE TABLE IF NOT EXISTS public.demo_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    hotel_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    country_code TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;

-- 3. Security Policies (OTP Style: allow browser inserts)
DROP POLICY IF EXISTS "Enable insert for everyone" ON public.demo_bookings;
CREATE POLICY "Enable insert for everyone" ON public.demo_bookings 
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable read for admins" ON public.demo_bookings;
CREATE POLICY "Enable read for admins" ON public.demo_bookings 
    FOR SELECT USING (true); -- In prod, restrict this to auth.role() = 'authenticated'

-- 4. Reminder System Support (1 Hour Before)
-- Use this function to identify bookings that need a reminder email.
-- To be called by an Edge Function or Cron Job.
DROP FUNCTION IF EXISTS check_upcoming_demo_reminders();
CREATE OR REPLACE FUNCTION check_upcoming_demo_reminders()
RETURNS TABLE (
    booking_id UUID, 
    booking_email TEXT, 
    booking_name TEXT, 
    booking_hotel TEXT,
    booking_time TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        id, 
        email, 
        name, 
        hotel_name,
        to_char(scheduled_at AT TIME ZONE 'UTC', 'HH24:MI, DD Mon YYYY "UTC"')
    FROM demo_bookings
    WHERE scheduled_at <= (now() + interval '1 hour')
      AND scheduled_at > now()
      AND reminder_sent = false;
END;
$$;

-- 5. Mark Reminders as Sent
-- Call this after your Edge Function successfully sends the reminder.
CREATE OR REPLACE FUNCTION mark_reminder_sent(target_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE demo_bookings 
    SET reminder_sent = true 
    WHERE id = target_id;
END;
$$;

-- ======================================================================
-- END OF SCRIPT
-- ======================================================================
