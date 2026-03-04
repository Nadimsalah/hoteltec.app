-- SQL Script to set up Demo Bookings table and Reminder system
-- Run this in your Supabase SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS demo_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    hotel_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    country_code TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable RLS
ALTER TABLE demo_bookings ENABLE ROW LEVEL SECURITY;

-- 3. Policies
CREATE POLICY "Anyone can book a demo" ON demo_bookings 
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Only admins can view demo bookings" ON demo_bookings 
    FOR SELECT USING (auth.role() = 'authenticated'); -- Adjust as needed

-- 4. Function to find bookings needing reminders (1 hour before)
-- This is intended to be called by a Cron Job
CREATE OR REPLACE FUNCTION check_upcoming_demo_reminders()
RETURNS TABLE (booking_id UUID, booking_email TEXT, booking_name TEXT, booking_time TIMESTAMP WITH TIME ZONE) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT id, email, name, scheduled_at
    FROM demo_bookings
    WHERE scheduled_at <= (now() + interval '1 hour')
      AND scheduled_at > now()
      AND reminder_sent = false;
END;
$$;
