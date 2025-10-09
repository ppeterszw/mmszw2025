-- Add cpd_points column to events table
-- This column tracks CPD (Continuing Professional Development) points awarded for attending events

-- Add the column
ALTER TABLE events
ADD COLUMN IF NOT EXISTS cpd_points INTEGER DEFAULT 0;

-- Show result
SELECT 'Column added successfully' as status;

-- Verify the column exists
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'events' AND column_name = 'cpd_points';
