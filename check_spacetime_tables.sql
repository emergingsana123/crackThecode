-- SpacetimeDB Table Inspection Queries
-- Run these queries to check all tables in the hophacks-chat module

-- 1. Check AiReplies table
-- Contains AI responses and analysis data
SELECT 'AiReplies Table:' AS table_name;
SELECT * FROM AiReplies;
SELECT COUNT(*) AS ai_replies_count FROM AiReplies;

-- 2. Check GameResult table  
-- Contains completed game results and outcomes
SELECT 'GameResult Table:' AS table_name;
SELECT * FROM GameResult;
SELECT COUNT(*) AS game_results_count FROM GameResult;

-- 3. Check GameRooms table
-- Contains active game room information
SELECT 'GameRooms Table:' AS table_name;
SELECT * FROM GameRooms;
SELECT COUNT(*) AS game_rooms_count FROM GameRooms;

-- 4. Check Leaderboard table
-- Contains player rankings and scores
SELECT 'Leaderboard Table:' AS table_name;
SELECT * FROM Leaderboard ORDER BY score DESC, extractionTime ASC;
SELECT COUNT(*) AS leaderboard_entries_count FROM Leaderboard;

-- 5. Check Messages table
-- Contains all chat messages and attack attempts
SELECT 'Messages Table:' AS table_name;
SELECT * FROM Messages ORDER BY timestamp DESC;
SELECT COUNT(*) AS messages_count FROM Messages;

-- 6. Check RoomPlayers table
-- Contains player-room associations
SELECT 'RoomPlayers Table:' AS table_name;
SELECT * FROM RoomPlayers;
SELECT COUNT(*) AS room_players_count FROM RoomPlayers;

-- 7. Check RoomTemplate table
-- Contains game templates and scenarios
SELECT 'RoomTemplate Table:' AS table_name;
SELECT * FROM RoomTemplate;
SELECT COUNT(*) AS room_templates_count FROM RoomTemplate;

-- 8. Check Users table
-- Contains user information and profiles
SELECT 'Users Table:' AS table_name;
SELECT * FROM Users;
SELECT COUNT(*) AS users_count FROM Users;

-- Summary queries for overview
SELECT 'DATABASE SUMMARY:' AS summary;
SELECT 
  (SELECT COUNT(*) FROM AiReplies) AS ai_replies,
  (SELECT COUNT(*) FROM GameResult) AS game_results,
  (SELECT COUNT(*) FROM GameRooms) AS game_rooms,
  (SELECT COUNT(*) FROM Leaderboard) AS leaderboard_entries,
  (SELECT COUNT(*) FROM Messages) AS messages,
  (SELECT COUNT(*) FROM RoomPlayers) AS room_players,
  (SELECT COUNT(*) FROM RoomTemplate) AS room_templates,
  (SELECT COUNT(*) FROM Users) AS users;

-- Recent activity queries
SELECT 'RECENT ACTIVITY:' AS activity;

-- Last 10 messages
SELECT 'Last 10 Messages:' AS recent_messages;
SELECT roomId, sender, text, timestamp, messageType 
FROM Messages 
ORDER BY timestamp DESC 
LIMIT 10;

-- Active rooms
SELECT 'Active Rooms:' AS active_rooms;
SELECT * FROM GameRooms WHERE status = 'active';

-- Top leaderboard entries
SELECT 'Top 10 Leaderboard:' AS top_players;
SELECT username, score, rank, extractionTime, updatedAt
FROM Leaderboard 
ORDER BY rank ASC
LIMIT 10;
