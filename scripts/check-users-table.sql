-- Check if users table exists
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name = 'users';

-- If exists, count records
SELECT COUNT(*) as user_count FROM users;
