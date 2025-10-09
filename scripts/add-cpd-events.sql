-- Add Two Events with CPD Points to Events Hub
-- Event 1: 5 CPD Points
-- Event 2: 10 CPD Points

-- Insert Event 1: Real Estate Law & Compliance Workshop (5 CPD Points)
INSERT INTO events (
  event_id,
  title,
  description,
  event_type,
  event_date,
  event_time,
  location,
  venue,
  capacity,
  registered_count,
  fee,
  cpd_points,
  start_date,
  end_date
) VALUES (
  'EVT-2025-0001',
  'Real Estate Law & Compliance Workshop',
  'An intensive workshop covering the latest updates in real estate law, regulatory compliance, and ethical practices for real estate professionals. This session will include case studies, Q&A sessions, and practical guidance on navigating legal challenges in the industry.',
  'workshop',
  '2025-11-15 09:00:00',
  '09:00 AM - 12:00 PM',
  'Harare International Conference Centre',
  'Conference Hall A',
  50,
  0,
  50.00,
  5,
  '2025-11-15 09:00:00',
  '2025-11-15 12:00:00'
) ON CONFLICT (event_id) DO NOTHING;

-- Insert Event 2: Advanced Property Valuation & Market Analysis (10 CPD Points)
INSERT INTO events (
  event_id,
  title,
  description,
  event_type,
  event_date,
  event_time,
  location,
  venue,
  capacity,
  registered_count,
  fee,
  cpd_points,
  start_date,
  end_date
) VALUES (
  'EVT-2025-0002',
  'Advanced Property Valuation & Market Analysis',
  'A comprehensive full-day seminar on advanced property valuation techniques, market analysis strategies, and investment assessment methods. Learn from industry experts about current market trends, valuation methodologies, and risk assessment frameworks. Includes hands-on exercises and certification upon completion.',
  'seminar',
  '2025-11-22 08:30:00',
  '08:30 AM - 05:00 PM',
  'Harare International Conference Centre',
  'Main Auditorium',
  100,
  0,
  75.00,
  10,
  '2025-11-22 08:30:00',
  '2025-11-22 17:00:00'
) ON CONFLICT (event_id) DO NOTHING;

-- Show the created events
SELECT '=== EVENTS CREATED ===' as status;
SELECT event_id, title, cpd_points, event_date, location, fee, capacity
FROM events
WHERE event_id IN ('EVT-2025-0001', 'EVT-2025-0002')
ORDER BY event_date;
