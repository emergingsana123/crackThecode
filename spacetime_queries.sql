/*
SpacetimeDB Table Check Queries
===============================

Copy and paste these queries into the SpacetimeDB console or CLI to check all tables.

Usage:
spacetime sql hophacks-chat "QUERY_HERE"

Or if you have access to the SpacetimeDB web console, paste each query individually.
*/

-- ======================
-- 1. AiReplies Table
-- ======================
-- Check structure
DESCRIBE AiReplies;

-- Count rows
SELECT COUNT(*) as ai_replies_count FROM AiReplies;

-- Sample data
SELECT * FROM AiReplies LIMIT 5;

-- ======================
-- 2. GameResult Table
-- ======================
-- Check structure  
DESCRIBE GameResult;

-- Count rows
SELECT COUNT(*) as game_results_count FROM GameResult;

-- Sample data
SELECT * FROM GameResult LIMIT 5;

-- ======================
-- 3. GameRooms Table
-- ======================
-- Check structure
DESCRIBE GameRooms;

-- Count rows
SELECT COUNT(*) as game_rooms_count FROM GameRooms;

-- Sample data
SELECT * FROM GameRooms LIMIT 5;

-- ======================
-- 4. Leaderboard Table
-- ======================
-- Check structure
DESCRIBE Leaderboard;

-- Count rows
SELECT COUNT(*) as leaderboard_count FROM Leaderboard;

-- Sample data (ordered by score)
SELECT * FROM Leaderboard ORDER BY score DESC LIMIT 5;

-- ======================
-- 5. Messages Table
-- ======================
-- Check structure
DESCRIBE Messages;

-- Count rows
SELECT COUNT(*) as messages_count FROM Messages;

-- Recent messages
SELECT * FROM Messages ORDER BY timestamp DESC LIMIT 5;

-- ======================
-- 6. RoomPlayers Table
-- ======================
-- Check structure
DESCRIBE RoomPlayers;

-- Count rows
SELECT COUNT(*) as room_players_count FROM RoomPlayers;

-- Sample data
SELECT * FROM RoomPlayers LIMIT 5;

-- ======================
-- 7. RoomTemplate Table
-- ======================
-- Check structure
DESCRIBE RoomTemplate;

-- Count rows
SELECT COUNT(*) as room_templates_count FROM RoomTemplate;

-- Sample data
SELECT * FROM RoomTemplate LIMIT 5;

-- ======================
-- 8. Users Table
-- ======================
-- Check structure
DESCRIBE Users;

-- Count rows
SELECT COUNT(*) as users_count FROM Users;

-- Sample data
SELECT * FROM Users LIMIT 5;

-- ======================
-- SUMMARY QUERIES
-- ======================

-- All table counts in one query
SELECT 
  (SELECT COUNT(*) FROM AiReplies) as ai_replies,
  (SELECT COUNT(*) FROM GameResult) as game_results,
  (SELECT COUNT(*) FROM GameRooms) as game_rooms,
  (SELECT COUNT(*) FROM Leaderboard) as leaderboard_entries,
  (SELECT COUNT(*) FROM Messages) as messages,
  (SELECT COUNT(*) FROM RoomPlayers) as room_players,
  (SELECT COUNT(*) FROM RoomTemplate) as room_templates,
  (SELECT COUNT(*) FROM Users) as users;

-- Recent activity summary
SELECT 'Recent Messages:' as activity_type;
SELECT roomId, sender, text, timestamp 
FROM Messages 
ORDER BY timestamp DESC 
LIMIT 10;

SELECT 'Top Players:' as activity_type;
SELECT username, score, rank 
FROM Leaderboard 
ORDER BY score DESC 
LIMIT 10;

-- ======================
-- DIAGNOSTIC QUERIES
-- ======================

-- Check for any data at all
SELECT 'Data Check:' as check_type;
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM Messages) > 0 THEN 'Messages table has data'
    WHEN (SELECT COUNT(*) FROM Users) > 0 THEN 'Users table has data'
    WHEN (SELECT COUNT(*) FROM Leaderboard) > 0 THEN 'Leaderboard table has data'
    ELSE 'No data found in primary tables'
  END as status;

-- Check table schemas exist
SELECT 'Schema Check:' as check_type;
SHOW TABLES;
