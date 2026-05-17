-- ============================================================
-- RUN THIS ONCE IN SUPABASE SQL EDITOR
-- After this, slots are created automatically forever.
-- You never need to touch this again.
-- ============================================================

-- Step 1: Add missing programme column if not there yet
ALTER TABLE students ADD COLUMN IF NOT EXISTS programme TEXT;

-- Step 2: Create the function that generates slots for the next 14 weekdays
CREATE OR REPLACE FUNCTION create_weekly_slots()
RETURNS void AS $$
DECLARE
  d DATE := CURRENT_DATE;
  days_checked INTEGER := 0;
  bus_a UUID;
  bus_b UUID;
  bus_c UUID;
BEGIN
  SELECT id INTO bus_a FROM buses WHERE bus_code = 'BUS-A' LIMIT 1;
  SELECT id INTO bus_b FROM buses WHERE bus_code = 'BUS-B' LIMIT 1;
  SELECT id INTO bus_c FROM buses WHERE bus_code = 'BUS-C' LIMIT 1;

  -- Loop through next 14 calendar days
  WHILE days_checked < 14 LOOP
    -- Only weekdays (1=Mon to 5=Fri)
    IF EXTRACT(DOW FROM d) BETWEEN 1 AND 5 THEN

      INSERT INTO time_slots (bus_id, departure_time, travel_date, available_seats, is_open)
      VALUES (bus_a, '06:00'::time, d, 30, true)
      ON CONFLICT (bus_id, departure_time, travel_date) DO NOTHING;

      INSERT INTO time_slots (bus_id, departure_time, travel_date, available_seats, is_open)
      VALUES (bus_b, '07:00'::time, d, 30, true)
      ON CONFLICT (bus_id, departure_time, travel_date) DO NOTHING;

      INSERT INTO time_slots (bus_id, departure_time, travel_date, available_seats, is_open)
      VALUES (bus_c, '08:00'::time, d, 45, true)
      ON CONFLICT (bus_id, departure_time, travel_date) DO NOTHING;

    END IF;

    d := d + 1;
    days_checked := days_checked + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Step 3: Run it immediately to create slots for the next 14 weekdays now
SELECT create_weekly_slots();

-- Step 4: Create a Supabase Cron Job to run it automatically every Monday
-- (Supabase uses pg_cron — this runs every Monday at 5am Ghana time = 5am UTC)
SELECT cron.schedule(
  'create-weekly-slots',       -- job name
  '0 5 * * 1',                 -- every Monday at 5:00 AM UTC
  'SELECT create_weekly_slots();'
);

-- ============================================================
-- DONE. Slots will now be created automatically every Monday.
-- The function creates the next 14 days of weekday slots,
-- so you're always covered 2 weeks ahead.
-- ============================================================
